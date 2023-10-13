using eCommerceWebsite.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data.SqlClient;

namespace eCommerceWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ItemDBContext itemDBContext;

        public UsersController(ItemDBContext itemDBContext)
        {
            this.itemDBContext = itemDBContext;
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
    }
}
