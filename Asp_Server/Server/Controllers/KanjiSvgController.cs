using System;
using System.IO;
using System.Text;
using Microsoft.AspNetCore.Mvc;


namespace Asp_Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class KanjiSvgController : ControllerBase
    {

        [HttpGet("getsvg/{character}")]
        public ActionResult GetSvg(string character) {
            if (character.Length > 1) {
                return BadRequest(new {Error = "Please provide only 1 character"});
            }
            Console.WriteLine(character.Length);
            byte[] bytes = Encoding.Unicode.GetBytes(character);
            // Byte array length should be 4
            int unicodeDecCode = BitConverter.ToUInt16(bytes);
            
            Console.WriteLine($"Unicode decimal code: {unicodeDecCode}");

            var path = Path.Combine(Environment.CurrentDirectory, $"CharSvgs\\{unicodeDecCode.ToString()}.svg");
            Console.WriteLine(path);
            if (!System.IO.File.Exists(path))
                return NotFound(new {Error = "Svg file not found"});
            
            var fs = System.IO.File.OpenRead(path);
            return File(fs, "image/svg+xml");
        } 
    }
}