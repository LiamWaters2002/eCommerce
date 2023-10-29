using eCommerceWebsite.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace eCommerceWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ItemDBContext itemDBContext;

        public CartController(ItemDBContext itemDBContext)
        {
            this.itemDBContext = itemDBContext;
        }

        [HttpGet]
        [Route("ViewCart")]
        public async Task<IEnumerable<Items>> ViewCart()
        {
            return await itemDBContext.Items.ToListAsync();
        }

        [HttpPost]
        [Route("AddToCart")]
        public async Task<Items> AddToCart(Items item)
        {
            itemDBContext.Items.Add(item);
            await itemDBContext.SaveChangesAsync();
            return item;
        }

        [HttpPatch]
        [Route("UpdateCartItem/{id}")]
        public async Task<Items> UpdateCartItem(Items item)
        {
            itemDBContext.Entry(item).State = EntityState.Modified;
            await itemDBContext.SaveChangesAsync();
            return item;
        }

        [HttpDelete]
        [Route("RemoveFromCart/{id}")]
        public bool RemoveFromCart(int id)
        {
            bool isRemoved = false;
            var item = itemDBContext.Items.Find(id);
            if (item != null)
            {
                isRemoved = true;
                itemDBContext.Entry(item).State = EntityState.Deleted;
                itemDBContext.SaveChanges();
            }
            return isRemoved;
        }
    }
}
