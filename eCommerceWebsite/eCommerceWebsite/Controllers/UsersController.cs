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

    }


}
