$ErrorActionPreference = 'Continue'
$base = 'C:\Users\arthu\Documents\WERK\projecten\bodista\images'
$urlsDir = Join-Path $base '_urls'
$files = Get-ChildItem -Path $urlsDir -Filter '*.txt'

$total = 0; $skipped = 0; $downloaded = 0; $failed = 0

foreach ($f in $files) {
    $slug = [IO.Path]::GetFileNameWithoutExtension($f.Name)
    $outDir = Join-Path $base ("cosmos_$slug")
    if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }
    $urls = Get-Content $f.FullName | Where-Object { $_ -match '^https?://' }
    Write-Host "[$slug] $($urls.Count) urls"
    $total += $urls.Count

    $urls | ForEach-Object -Parallel {
        $url = $_
        $outDir = $using:outDir
        $uuid = ($url -split '/')[-1]
        $dest = Join-Path $outDir "cosmos_$uuid.webp"
        if (Test-Path $dest) {
            return @{ status = 'skipped' }
        }
        try {
            Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing -TimeoutSec 30 -ErrorAction Stop | Out-Null
            return @{ status = 'ok' }
        } catch {
            return @{ status = 'fail'; error = $_.Exception.Message }
        }
    } -ThrottleLimit 8 | ForEach-Object {
        switch ($_.status) {
            'skipped' { $skipped++ }
            'ok'      { $downloaded++ }
            'fail'    { $failed++ }
        }
    }
}

Write-Host "----"
Write-Host "Total URLs: $total"
Write-Host "Downloaded: $downloaded"
Write-Host "Skipped (existed): $skipped"
Write-Host "Failed: $failed"
