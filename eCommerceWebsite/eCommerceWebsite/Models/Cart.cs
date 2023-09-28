namespace eCommerceWebsite.Models
{
    public class Cart
    {
        public int ID { get; set; }
        public int UserID { get; set; }
        public int ItemID { get; set; }
        public string UnitPrice { get; set; }
        public string Discount { get; set; }
        public string Quantity { get; set; }
        public string TotalPrice { get; set; }
    }
}
