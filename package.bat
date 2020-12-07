start /separate /wait cmd /c "ng build" &

cd dist
ren browser wwwroot

SET name="balcao.zip"

IF EXIST %name% (
	DEL %name%
)

7z a %name% .\

move /y %name% C:\inetpub\wwwroot\d1000-dist\packages

cd C:\inetpub\wwwroot\d1000-dist\packages

icacls %name% /inheritance:e