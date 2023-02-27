// See https://aka.ms/new-console-template for more information

using System;
using System.Threading.Tasks;
using Xunit;
using Microsoft.AspNetCore.Mvc.Testing;

public class TestProgram
{
    public static void Main(string[] args) {
        Console.WriteLine("Hello, World!");
        var app = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder => {

            });

        var client = app.CreateClient();
        //var response = client.GetAsync("/KanjiSvg/あ");
    }
    
    [Fact]
    private async Task HelloWorldTest() {
        var app = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder => {

            });

        var client = app.CreateClient();
        var response = client.GetAsync("/KanjiSvg/あ");
        Console.WriteLine("asdad");
    }

}