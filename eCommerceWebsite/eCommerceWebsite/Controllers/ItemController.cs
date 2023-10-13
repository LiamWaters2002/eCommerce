using eCommerceWebsite.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace eCommerceWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly ItemDBContext itemDBContext;

        public ItemController(ItemDBContext itemDBContext)
        {
            this.itemDBContext = itemDBContext;
        }

        [HttpGet]
        [Route("GetItem")]
        public async Task<IEnumerable<Items>> GetItems()
        {
            return await itemDBContext.Items.ToListAsync();
        }

        [HttpPost]
        [Route("AddItem")]
        public async Task<Items> AddItem(Items item)
        {
            itemDBContext.Items.Add(item);
            await itemDBContext.SaveChangesAsync();
            return item;
        }


        [HttpPatch]
        [Route("UpdateItem/{id}")]
        public async Task<Items> UpdateItem(Items item)
        {
            itemDBContext.Entry(item).State = EntityState.Modified;
            await itemDBContext.SaveChangesAsync();
            return item;
        }

        [HttpDelete]
        [Route("DeleteItem/{id}")]
        public bool DeleteItem(int id)
        {
            bool isDeleted = false;
            var item = itemDBContext.Items.Find(id);
            if (item != null) 
            {
                isDeleted = true;
                itemDBContext.Entry(item).State = EntityState.Deleted;
                itemDBContext.SaveChanges();

            }
            return isDeleted;
        }

    }
}
