namespace eCommerceWebsite.Models
{
    public class OrderItems
    {
        public int ID { get; set; }
        public int OrderID { get; set; }
        public string UnitPrice { get; set; }
        public string Discount { get; set; }
        public string Quantity { get; set; }
        public string TotalPrice { get; set; }
    }
}
