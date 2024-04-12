const template = `
<!DOCTYPE html>
<html>
<head>
<title>MHSOSA</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>

<body style="font-family: Lato, sans-serif; color: #fff;">
<table id="main" width="750"  border="0" align="center" cellpadding="0" cellspacing="0" style="background-image: url(https://pyoji.com/mhsosa/mhsosa-3rd-alumni-meet-bg.jpg);"> 
  <tbody>
    <tr>
      <td>

        <table id="01" width="750"  border="0" align="center" cellpadding="0" cellspacing="0">
          <tbody>
            
            <tr>
              <td align="center" style="padding-top: 690px;">
                <img src=[IMAGE_PATH] alt="QR">
              </td>
            </tr>

            <tr>
              <td align="center" style="font-size: 40px; font-weight: 700; padding-bottom: 200px;">
                [USER_NAME]
              </td>
            </tr>
            

          </tbody>
        </table>

      </td>
    </tr>
  </tbody>
</table>
</body>
</html>
`;

module.exports = template;
