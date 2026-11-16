using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using ProfileApi.Models;

namespace ProfileApi.Controllers;

[ApiController]
[Route("profiles/restore")]
public class RestoreController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Restore()
    {
        var profile = await JsonSerializer.DeserializeAsync<Profile>(Request.Body);

        return profile is null ? BadRequest() : Ok(new { profile.DisplayName });
    }
}
