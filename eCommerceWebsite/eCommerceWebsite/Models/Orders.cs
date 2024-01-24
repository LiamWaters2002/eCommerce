namespace eCommerceWebsite.Models
{
    public class Orders
    {
        public int ID { get; set; }
        public string UserId { get; set; }
        
        public int ItemId { get; set; }
        public int OrderNumber { get; set; }
        public string OrderDate { get; set; }
        public string OrderStatus { get; set; }
    }
}
