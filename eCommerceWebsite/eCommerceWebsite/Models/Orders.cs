namespace eCommerceWebsite.Models
{
    public class Orders
    {
        public int ID { get; set; }
        public int UserID { get; set; }
        
        public int ItemId { get; set; }
        public string OrderNumber { get; set; }
        public decimal OrderTotal { get; set; }
        public string OrderStatus { get; set; }
    }
}
