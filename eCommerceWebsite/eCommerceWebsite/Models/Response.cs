using Microsoft.AspNetCore.Mvc;

namespace eCommerceWebsite.Models
{
    public class Response
    {
        public int StatusCode { get; set; }

        public string StatusMessage { get; set; }

        public List<Users> listUsers { get; set; }

        public Users users { get; set; }

        public List<Items> listItems { get; set; }

        public Items items { get; set; }

        public List<Cart> listCart { get; set; }

        public List<Orders> listOrders { get; set; }

        public Orders order { get; set; }

        public List<OrderItems> listOrderItems { get; set; }

        public OrderItems orderItems { get; set; }

    }
}
