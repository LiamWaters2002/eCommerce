using eCommerceWebsite.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace eCommerceWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ItemDBContext itemDBContext;

        public OrderController(ItemDBContext itemDBContext)
        {
            this.itemDBContext = itemDBContext;
        }

        [HttpGet]
        [Route("GetOrders")]
        public async Task<IEnumerable<Orders>> GetOrders()
        {
            return await itemDBContext.Orders.ToListAsync();
        }

        [HttpGet]
        [Route("GetOrdersById")]
        public async Task<IEnumerable<Orders>> GetOrdersById(string userId)
        {
            // Assuming there is a UserId property in the Orders model
            return await itemDBContext.Orders
                .Where(order => order.UserId == userId)
                .ToListAsync();
        }

        [HttpGet]
        [Route("GetSellerItemsById/{userId}")]
        public async Task<IEnumerable<Items>> GetSellerItemsById(string userId)
        {
            // Assuming there is a UserId property in the Orders model
            return await itemDBContext.Items
                .Where(item => item.Manufacturer == userId)
                .ToListAsync();
        }

        [HttpGet]
        [Route("GetSellerOrders/{userId}")]
        public async Task<IEnumerable<Orders>> GetSellerOrders(string userId)
        {
            return await itemDBContext.Orders
                .Where(order => itemDBContext.Items.Any(item => item.ID == order.ItemId && item.Manufacturer == userId))
                .ToListAsync();
        }

        [HttpPost]
        [Route("PlaceOrder")]
        public async Task<Orders> PlaceOrder(Orders order)
        {
            itemDBContext.Orders.Add(order);
            await itemDBContext.SaveChangesAsync();
            return order;
        }

        [HttpPatch]
        [Route("UpdateOrder/{id}")]
        public async Task<Orders> UpdateOrder(Orders order)
        {
            itemDBContext.Entry(order).State = EntityState.Modified;
            await itemDBContext.SaveChangesAsync();
            return order;
        }

        [HttpDelete]
        [Route("CancelOrder/{id}")]
        public bool CancelOrder(int id)
        {
            bool isCanceled = false;
            var order = itemDBContext.Orders.Find(id);
            if (order != null)
            {
                isCanceled = true;
                itemDBContext.Entry(order).State = EntityState.Deleted;
                itemDBContext.SaveChanges();
            }
            return isCanceled;
        }
    }
}
