using Azure.Core;
using eCommerceWebsite.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data.SqlClient;
using System.Security.Cryptography;
using System.Text;

namespace eCommerceWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {

        private readonly SignInManager<IdentityUser> signInManager;

        private readonly ItemDBContext itemDBContext;

        public UsersController(ItemDBContext itemDBContext, SignInManager<IdentityUser> signInManager)
        {
            this.itemDBContext = itemDBContext;
            this.signInManager = signInManager;
        }

        [HttpGet]
        [Route("GetUser")]
        public async Task<IEnumerable<Users>> GetUsers()
        {
            return await itemDBContext.Users.ToListAsync();
        }

        [HttpPost]
        [Route("AddUser")]
        public async Task<Users> AddUser(Users user)
        {
            itemDBContext.Users.Add(user);
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
            var user = await itemDBContext.Users.FindAsync(id);
            if (user != null)
            {
                itemDBContext.Users.Remove(user);
                await itemDBContext.SaveChangesAsync();
                return true;
            }

            return false;
        }

        [HttpPost]
        [Route("Registration")]
        public async Task<String> Registration(Users user)
        {
            var existingUser = await itemDBContext.Users.FirstOrDefaultAsync(u => u.Email == user.Email); // Retrieve first user with that email, or return null if not in db.

            if (existingUser != null)
            {
                return "Email is already registered.";
            }

            //Registration server-side default values...
            user.Createdon = DateTime.Now;
            user.Type = "Customer";

            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(user.Password));
                string hashedPassword = BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
                user.Password = hashedPassword;
            }

            itemDBContext.Users.Add(user);
            await itemDBContext.SaveChangesAsync();

            var loginResult = await LoginByRegister(user.Email, user.Password);
            return loginResult;
        }

        private async Task<string> LoginByRegister(string email, string password)
        {
            using (HttpClient client = new HttpClient())
            {
                string loginApiEndpoint = "https://localhost:7195/api/Users/Login";
                var loginData = new { Email = email, Password = password };

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

        [HttpPost("login")]
        public async Task<string> Login(string email, string password)
        {
            // Check if the user exists
            var user = await itemDBContext.Users.SingleOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return "Invalid login credentials";
            }

            // Check if the provided password matches the stored hashed password
            if (!VerifyPasswordHash(password, user.Password))
            {
                return "Invalid login credentials";
            }
 
            var result = await signInManager.PasswordSignInAsync(user.ID.ToString(), user.Password, true, false);

            if(result.Succeeded)
            {
                return "Suceeded in logging in";
            }
            // Return a successful response 
            return "Valid but not logged in";
        }

        private bool VerifyPasswordHash(string password, string storedHash)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                // Compute the hash of the provided password
                byte[] inputBytes = Encoding.UTF8.GetBytes(password);
                byte[] hashedBytes = sha256.ComputeHash(inputBytes);
                string hashedPassword = BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();

                // Compare the computed hash with the stored hash
                return string.Equals(hashedPassword, storedHash, StringComparison.OrdinalIgnoreCase);
            }
        }
    }
}
