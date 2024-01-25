using Azure.Core;
using eCommerceWebsite.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;

namespace eCommerceWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<IdentityUser> userManager;

        private readonly SignInManager<IdentityUser> signInManager;

        private readonly ItemDBContext itemDBContext;

        private IConfiguration configuration;

        public UsersController(ItemDBContext itemDBContext, SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager, IConfiguration configuration)
        {
            this.itemDBContext = itemDBContext;
            this.signInManager = signInManager;
            this.userManager = userManager;
            this.configuration = configuration;
        }

        [HttpGet]
        [Route("GetUser")]
        public async Task<IEnumerable<IdentityUser>> GetUsers()
        {
            return await itemDBContext.AspNetUsers.ToListAsync();
        }

        [HttpGet]
        [Route("GetUserById/{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await itemDBContext.AspNetUsers.FindAsync(id);

            if (user == null)
            {
                return NotFound(); // Return 404 Not Found if the user with the given ID is not found.
            }

            return Ok(user); // Return 200 OK with the user details.
        }

        [HttpPost]
        [Route("AddUser")]
        public async Task<Users> AddUser(Users user)
        {
            itemDBContext.AspNetUsers.Add(user);
            await itemDBContext.SaveChangesAsync();
            return user;
        }

        [HttpPatch]
        [Route("UpdateUser/{id}")]
        public async Task<Users> UpdateUser(int id, Users user)
        {
            itemDBContext.Entry(user).State = EntityState.Modified;
            await itemDBContext.SaveChangesAsync();
            return user;
        }

        [HttpDelete]
        [Route("DeleteUser/{id}")]
        public async Task<bool> DeleteUser(int id)
        {
            var user = await itemDBContext.AspNetUsers.FindAsync(id);
            if (user != null)
            {
                itemDBContext.AspNetUsers.Remove(user);
                await itemDBContext.SaveChangesAsync();
                return true;
            }

            return false;
        }

        [HttpPost]
        [Route("Registration")]
        public async Task<String> Registration([FromBody] IdentityUser model)
        {
            var existingEmail = await itemDBContext.AspNetUsers.FirstOrDefaultAsync(u => u.Email == model.Email);

            if (existingEmail != null)
            {
                return "Email is already registered.";
            }

            itemDBContext.AspNetUsers.Add(model);
            var result = await signInManager.CreateUserPrincipalAsync(model);

            try
            {
                await itemDBContext.SaveChangesAsync(); // Save changes to the database
                return "complete";
            }
            catch (Exception ex)
            {
                // Handle any exceptions that may occur during the save process.
                return "Error: " + ex.GetBaseException().Message;
            }
        }

        private async Task<string> LoginByRegister(string email, string PasswordHash)
        {
            using (HttpClient client = new HttpClient())
            {
                string loginApiEndpoint = "https://localhost:7195/api/Users/Login";
                var loginData = new { Email = email, PasswordHash = PasswordHash };

                // Send a POST request to the login API
                HttpResponseMessage response = await client.PostAsJsonAsync(loginApiEndpoint, loginData);

                if (response.IsSuccessStatusCode)
                {
                    // Assuming the login API returns a message or token upon success
                    string loginResponse = await response.Content.ReadAsStringAsync();
                    return loginResponse;
                }
                else
                {
                    // Handle error or failure in the login API
                    return "Login failed. Please try again.";
                }
            }
        }

        [HttpPost("Login")]
        public async Task<ActionResult> Login([FromBody] Users model)
        {
            Console.WriteLine("Got here");
            string Email = model.Email;
            string PasswordHash = model.PasswordHash;
            // Check if the user exists
            var user = await itemDBContext.AspNetUsers.SingleOrDefaultAsync(u => u.Email == Email);

            if (user == null)
            {
                return BadRequest(new { message = "Invalid login credentials" });
            }

            // Check if the provided PasswordHash matches the stored hashed PasswordHash
            if (!VerifyPasswordHash(PasswordHash, user.PasswordHash))
            {
                return BadRequest(new { message = "Invalid login credentials" });
            }
 
            //var result = await signInManager.PasswordSignInAsync(user.UserName.ToString(), user.PasswordHash, true, false);

            //if(result.Succeeded)
            if(true)
            {
                string token = CreateToken(user);
                return Ok(new { token = token, username =  user.Id});
            }
            // Return a successful response 
            return Ok(new { message = "Valid but not logged in" });
        }

        private bool VerifyPasswordHash(string PasswordHash, string storedHash)
        {

            //USE THIS CODE LATER ONCE HASHING WORKS CORRECTLY...

            //using (sha256 sha256 = sha256.create())
            //{
            //    // compute the hash of the provided passwordhash
            //    byte[] inputbytes = encoding.utf8.getbytes(passwordhash);
            //    byte[] hashedbytes = sha256.computehash(inputbytes);
            //    string hashedpasswordhash = bitconverter.tostring(hashedbytes).replace("-", "").tolower();

            //    // compare the computed hash with the stored hash
            //    return string.equals(hashedpasswordhash, storedhash, stringcomparison.ordinalignorecase);
            //}

            return string.Equals(PasswordHash, storedHash);

        }

        private string CreateToken(IdentityUser user)
        {

            var tokenConfig = configuration.GetSection("AppSettings:Token").Value;

            if (tokenConfig == null)
            {
                // Handle the case where the configuration value is not found.
                // You might want to log an error or throw an exception.
                throw new InvalidOperationException("Token configuration not found.");
            }

            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Id)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenConfig!));
                //configuration.GetSection("AppSettings:Token").Value!));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var token = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.Now.AddDays(1),
                    signingCredentials: cred
                );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }
    }
}
