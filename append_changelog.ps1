param(
    [Parameter(Mandatory = $true)][string]$DocumentPath
)

Add-Type -AssemblyName System.IO.Compression.FileSystem

$fullPath = (Resolve-Path -LiteralPath $DocumentPath).Path
$tempPath = Join-Path ([System.IO.Path]::GetTempPath()) ("tantulink-docx-" + [guid]::NewGuid().ToString())
[System.IO.Directory]::CreateDirectory($tempPath) | Out-Null

try {
    [System.IO.Compression.ZipFile]::ExtractToDirectory($fullPath, $tempPath)
    $documentXmlPath = Join-Path $tempPath 'word\document.xml'
    $xml = New-Object System.Xml.XmlDocument
    $xml.PreserveWhitespace = $true
    $xml.Load($documentXmlPath)

    $ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
    $ns.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
    $body = $xml.SelectSingleNode('//w:body', $ns)
    $headingTemplate = $xml.SelectSingleNode('//w:body/w:p[w:pPr/w:rPr/w:b][last()]', $ns)
    if ($null -eq $headingTemplate) { throw 'Could not locate the document heading formatting.' }

    function New-Paragraph([string]$Text, [bool]$Bold = $false, [bool]$Bullet = $false, [bool]$PageBreak = $false) {
        $p = $xml.CreateElement('w', 'p', $ns.LookupNamespace('w'))
        if ($Bold -or $Bullet) {
            $pPr = $xml.CreateElement('w', 'pPr', $ns.LookupNamespace('w'))
            if ($Bold) {
                $rPrP = $xml.CreateElement('w', 'rPr', $ns.LookupNamespace('w'))
                $bP = $xml.CreateElement('w', 'b', $ns.LookupNamespace('w'))
                $bCsP = $xml.CreateElement('w', 'bCs', $ns.LookupNamespace('w'))
                [void]$rPrP.AppendChild($bP); [void]$rPrP.AppendChild($bCsP); [void]$pPr.AppendChild($rPrP)
            }
            if ($Bullet) {
                $ind = $xml.CreateElement('w', 'ind', $ns.LookupNamespace('w'))
                $ind.SetAttribute('left', $ns.LookupNamespace('w'), '720')
                $ind.SetAttribute('hanging', $ns.LookupNamespace('w'), '360')
                [void]$pPr.AppendChild($ind)
            }
            [void]$p.AppendChild($pPr)
        }
        $r = $xml.CreateElement('w', 'r', $ns.LookupNamespace('w'))
        if ($Bold) {
            $rPr = $xml.CreateElement('w', 'rPr', $ns.LookupNamespace('w'))
            $b = $xml.CreateElement('w', 'b', $ns.LookupNamespace('w'))
            $bCs = $xml.CreateElement('w', 'bCs', $ns.LookupNamespace('w'))
            [void]$rPr.AppendChild($b); [void]$rPr.AppendChild($bCs); [void]$r.AppendChild($rPr)
        }
        if ($PageBreak) {
            $br = $xml.CreateElement('w', 'br', $ns.LookupNamespace('w'))
            $br.SetAttribute('type', $ns.LookupNamespace('w'), 'page')
            [void]$r.AppendChild($br)
        } else {
            $t = $xml.CreateElement('w', 't', $ns.LookupNamespace('w'))
            if ($Text.StartsWith(' ') -or $Text.EndsWith(' ')) { $t.SetAttribute('xml:space', 'http://www.w3.org/XML/1998/namespace', 'preserve') }
            $t.InnerText = $Text
            [void]$r.AppendChild($t)
        }
        [void]$p.AppendChild($r)
        Write-Output -NoEnumerate $p
    }

    $items = @(
        @{ text = ''; page = $true },
        @{ text = '================================================================================'; bold = $true },
        @{ text = 'SECTION: RECENT TECHNICAL CHANGELOG & FEATURE IMPLEMENTATION SUMMARY'; bold = $true },
        @{ text = '================================================================================'; bold = $true },
        @{ text = '' },
        @{ text = '1. Producer Capacity Limits (Solo to Cooperative)'; bold = $true },
        @{ text = '- Data Model & Profile Integration: Extended user profile and product data models to store producer-defined weekly and monthly production capacity limits.'; bullet = $true },
        @{ text = '- Fair Working Hours Helper Guidance: Added contextual helper notes during producer onboarding and profile management explaining that capacity metrics protect fair working hours and handmade craft quality.'; bullet = $true },
        @{ text = '- Buyer-Facing Transparency: Displayed clear capacity indicators on product pages (e.g., "Available for solo/single-piece orders" and "Bulk order capacity: up to X units/month").'; bullet = $true },
        @{ text = '- Friendly Capacity Warning: Implemented non-blocking warning banners when a buyer''s requested bulk quantity exceeds the producer''s stated monthly capacity, recommending staged delivery schedules or flagging for manual artisan feasibility review.'; bullet = $true },
        @{ text = '' },
        @{ text = '2. Demand Intelligence Widget'; bold = $true },
        @{ text = '- Integrated a lightweight Demand Intelligence panel into the seller dashboard using platform category trends and seasonal demand forecasts.'; bullet = $true },
        @{ text = '- Highlights top-trending craft categories, demand growth metrics, and upcoming seasonal festival/wedding demand spikes to help artisans plan inventory.'; bullet = $true },
        @{ text = '- Designed to handle sparse historical data gracefully by presenting baseline category popularity metrics.'; bullet = $true },
        @{ text = '' },
        @{ text = '3. Government Schemes Panel ("Schemes for You")'; bold = $true },
        @{ text = '- Curated a structured dataset of Indian government handicraft schemes, subsidies, credit programs, and export incentives (e.g., NHDP, Handloom Mark & Silk Mark Grants, PM MUDRA, PM VIKAS, MEIS/RoDTEP Export Rebates, and GI Registration Financial Support).'; bullet = $true },
        @{ text = '- Displayed an interactive, categorized recommendation panel within the seller dashboard with direct access links for artisans.'; bullet = $true },
        @{ text = '' },
        @{ text = '4. Custom / Bulk Order Builder'; bold = $true },
        @{ text = '- Replaced unstructured inquiry flows with a structured Custom & Bulk Order Builder spec form.'; bullet = $true },
        @{ text = '- Enables buyers to submit custom specifications, quantities, and desired completion timelines.'; bullet = $true },
        @{ text = '- Integrates directly with the seller dashboard for artisan quotation and acceptance.'; bullet = $true },
        @{ text = '- Upon confirmation, custom orders automatically plug into the platform''s existing milestone escrow payment protection system.'; bullet = $true },
        @{ text = '' },
        @{ text = '5. Voice Translator Bug Fix & Multilingual Robustness'; bold = $true },
        @{ text = '- Diagnosed root cause of Kannada voice TTS failure: long sentence text strings exceeded Google Translate TTS query limits (~150-200 characters), returning HTTP 400 errors and causing silent SpeechSynthesis fallbacks.'; bullet = $true },
        @{ text = '- Upgraded the backend proxy route (/api/tts) with sentence-level text chunking and asynchronous MP3 buffer concatenation.'; bullet = $true },
        @{ text = '- Verified 100% audio playback success across English (en), Kannada (kn), and Hindi (hi).'; bullet = $true },
        @{ text = '' },
        @{ text = '6. Files Modified:'; bold = $true },
        @{ text = '- src/types.ts (Data models for capacity, schemes, and custom orders)'; bullet = $true },
        @{ text = '- src/data.ts (Datasets for government schemes, demand intelligence, and mock capacity)'; bullet = $true },
        @{ text = '- server.ts (Chunked TTS proxy server implementation)'; bullet = $true },
        @{ text = '- src/components/OnboardingFlow.tsx (Producer capacity fields during setup)'; bullet = $true },
        @{ text = '- src/components/AccountModal.tsx (Artisan capacity limits in profile passport)'; bullet = $true },
        @{ text = '- src/components/WeaverView.tsx (Demand Intelligence, Schemes Panel, & Custom Orders Pipeline)'; bullet = $true },
        @{ text = '- src/components/BuyerView.tsx (Capacity badges & Custom/Bulk Order Builder modal)'; bullet = $true },
        @{ text = '================================================================================'; bold = $true }
    )

    $sectionProperties = $body.SelectSingleNode('./w:sectPr', $ns)
    foreach ($item in $items) {
        $p = @(New-Paragraph $item.text ([bool]$item.bold) ([bool]$item.bullet) ([bool]$item.page))[-1]
        [void]$body.InsertBefore($p, $sectionProperties)
    }
    $xml.Save($documentXmlPath)

    $backupPath = "$fullPath.backup"
    Copy-Item -LiteralPath $fullPath -Destination $backupPath -Force
    Remove-Item -LiteralPath $fullPath -Force
    $archive = [System.IO.Compression.ZipFile]::Open($fullPath, [System.IO.Compression.ZipArchiveMode]::Create)
    try {
        Get-ChildItem -LiteralPath $tempPath -File -Recurse | ForEach-Object {
            $relativePath = $_.FullName.Substring($tempPath.Length + 1).Replace('\', '/')
            $archiveEntry = $archive.CreateEntry($relativePath, [System.IO.Compression.CompressionLevel]::Optimal)
            $input = [System.IO.File]::OpenRead($_.FullName)
            $output = $archiveEntry.Open()
            try { $input.CopyTo($output) }
            finally { $output.Dispose(); $input.Dispose() }
        }
    }
    finally { $archive.Dispose() }
    Write-Output "Updated document: $fullPath"
    Write-Output "Backup created: $backupPath"
}
finally {
    if (Test-Path -LiteralPath $tempPath) { Remove-Item -LiteralPath $tempPath -Recurse -Force }
}
