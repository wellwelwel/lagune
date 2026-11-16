using System.Runtime.Serialization.Formatters.Binary;
using Microsoft.AspNetCore.Mvc;
using ProfileApi.Models;

namespace ProfileApi.Controllers;

[ApiController]
[Route("profiles/import")]
public class ImportController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Import()
    {
        using var buffer = new MemoryStream();
        await Request.Body.CopyToAsync(buffer);
        buffer.Position = 0;

#pragma warning disable SYSLIB0011
        var profile = (Profile)new BinaryFormatter().Deserialize(buffer);
#pragma warning restore SYSLIB0011

        return Ok(new { profile.DisplayName });
    }
}
