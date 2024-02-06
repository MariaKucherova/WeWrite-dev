using System.Text.RegularExpressions;

namespace WeWriteWeb
{
    public class Program
    {
        public static void Main(string[] args)
        {
            List<Note> notes = new List<Note>()
            {
                new Note() { Id = Guid.NewGuid(), Title = "Title 1", Text = "Text 1" },
                new Note() { Id = Guid.NewGuid(), Title = "Title 2", Text = "Text 2" },
                new Note() { Id = Guid.NewGuid(), Title = "Title 3", Text = "Text 3" },
                new Note() { Id = Guid.NewGuid(), Title = "Title 4", Text = "Text 4" },
            };

            var builder = WebApplication.CreateBuilder(args);
            var app = builder.Build();

            app.UseStaticFiles();

            app.Run(async (context) =>
            {
                var request = context.Request;
                var response = context.Response;
                var path = request.Path;

                string expressionForGuid = @"^/notes/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$";

                if (path == "/notes" && request.Method == "GET")
                {
                    await GetNotes(response);
                }
                else if (Regex.IsMatch(path, expressionForGuid) && request.Method == "GET")
                {
                    string? id = path.Value?.Split("/")[2];
                    await GetNote(response, id);
                }
                else if (path == "/notes" && request.Method == "PUT")
                {
                    await UpdateNote(request, response);
                }
                else if (Regex.IsMatch(path, expressionForGuid) && request.Method == "DELETE")
                {
                    string? id = path.Value?.Split("/")[2];
                    await DeleteNote(id, response);
                }
                else
                {
                    response.ContentType = "text/html; charset=utf-8";
                    await response.SendFileAsync("wwwroot/html/index.html");
                }
            });

            app.Run();

            async Task GetNotes(HttpResponse response)
            {
                await response.WriteAsJsonAsync(notes);
            }

            async Task GetNote(HttpResponse response, string? id)
            {
                Note? note = notes.FirstOrDefault(n => n.Id.ToString() == id);

                if (note != null)
                {
                    await response.WriteAsJsonAsync(note);
                }
                else
                {
                    response.StatusCode = 404;
                    await response.WriteAsJsonAsync(new { message = "The note is not found" });
                }
            }

            async Task UpdateNote(HttpRequest request, HttpResponse response)
            {
                try
                {
                    Note? noteData = await request.ReadFromJsonAsync<Note>();
                    
                    if (noteData != null)
                    {
                        var note = notes.FirstOrDefault(n => n.Id == noteData.Id);

                        if (note != null)
                        {
                            note.Text = noteData.Text;
                            note.Title = noteData.Title;
                            await response.WriteAsJsonAsync(note);
                        }
                        else
                        {
                            response.StatusCode = 404;
                            await response.WriteAsJsonAsync(new { message = "The note is not found" });
                        }
                    }
                    else
                    {
                        throw new Exception("Incorrect data");
                    }
                }
                catch(Exception ex)
                {
                    response.StatusCode = 400;
                    await response.WriteAsJsonAsync(new { message = ex.Message });
                }
            }

            async Task DeleteNote(string? id, HttpResponse response)
            {
                Note? note = notes.FirstOrDefault(n => n.Id.ToString() == id);

                if (note != null)
                {
                    notes.Remove(note);
                    await response.WriteAsJsonAsync(note);
                }
                else
                {
                    response.StatusCode = 404;
                    await response.WriteAsJsonAsync(new { message = "The note is not found" });
                }
            }
        }
    }
}
