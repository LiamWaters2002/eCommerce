namespace eCommerceWebsite.Models
{
    public class Orders
    {
        public int ID { get; set; }
        public int UserID { get; set; }
        public string OrderNumber { get; set; }
        public string OrderTotal { get; set; }
        public string OrderStatus { get; set; }
    }
}
