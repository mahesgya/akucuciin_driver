import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import driverService from "../../services/driverService";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Select, MenuItem, Button } from "@mui/material";
import { Card, CardContent, CardActions, Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Swal from "sweetalert2";

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editedData, setEditedData] = useState({ status: "" });

  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const response = await driverService.getOrderDriver(accessToken);
      setOrders(response.data);
      setLoading(false);
    };

    fetchOrders();
  }, [accessToken]);

  const statusOptions = ["pending", "penjemputan", "pencucian", "selesai", "batal", "kesalahan"];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning.main";
      case "penjemputan":
        return "info.main";
      case "pencucian":
        return "primary.main";
      case "selesai":
        return "success.main";
      case "batal":
        return "error.main";
      case "kesalahan":
        return "grey.500";
      default:
        return "text.primary";
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order.id);
    setEditedData({
      status: order.status,
    });
  };

  const handleSave = async (id) => {
    const confirmed = await Swal.fire({
      icon: "warning",
      title: "Yakin ingin mengubah data order ini?",
      showCancelButton: true,
      confirmButtonText: "Ubah",
      cancelButtonText: "Batal",
    });

    if (confirmed.isConfirmed) {
      await driverService.putOrderDriver(accessToken, id, editedData);
      setOrders((prevOrders) => prevOrders.map((order) => (order.id === id ? { ...order, ...editedData } : order)));
      setEditingOrder(null);
    }
  };

  const handleChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(orders.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        DAFTAR ORDER AKUCUCIIN
      </Typography>
      {currentItems.map((item, index) => (
        <Card key={item.id} style={{ width: "100%", maxWidth: 900, marginBottom: 16, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                {index + 1}. {item.customer.name} - {item.status} - {new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(new Date(item.created_at))}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ fontFamily: "Quicksand" }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography>
                      <strong>Order Id:</strong> {item.id}
                    </Typography>
                    <Typography>
                      <strong>Tanggal:</strong> {new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(new Date(item.created_at))}
                    </Typography>
                    <Typography>
                      <strong>Email:</strong> {item.customer.email}
                    </Typography>
                    <Typography>
                      <strong>Telephone:</strong> {item.customer.telephone}
                    </Typography>
                    <Typography>
                      <strong>Address:</strong> {item.customer.address}
                    </Typography>
                    <Typography>
                      <strong>Kode Promo:</strong> {item.coupon_code || "-"}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography>
                      <strong>Laundry:</strong> {item.laundry_partner.name}
                    </Typography>
                    <Typography>
                      <strong>Paket:</strong> {item.package.name}
                    </Typography>
                    <Typography>
                      <strong>Status: </strong>
                      {editingOrder === item.id ? (
                        <Select value={editedData.status} onChange={(e) => handleChange(e, "status")}>
                          {statusOptions.map((status) => (
                            <MenuItem key={status} value={status}>
                              <Typography component="span" sx={{ color: getStatusColor(status) }}>
                                {status}
                              </Typography>
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        <Typography component="span" sx={{ color: getStatusColor(item.status) }}>
                          {item.status}
                        </Typography>
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions display="flex" justify="between" items="center">
                <div>
                  {editingOrder === item.id ? (
                    <Button variant="contained" color="success" onClick={() => handleSave(item.id)}>
                      Simpan
                    </Button>
                  ) : (
                    <Button variant="contained" color="primary" onClick={() => handleEdit(item)}>
                      Edit
                    </Button>
                  )}
                </div>
              </CardActions>
            </AccordionDetails>
          </Accordion>
        </Card>
      ))}

      <div style={{ marginTop: "16px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} variant="contained" color="primary" style={{ margin: "4px" }}>
          Prev
        </Button>
        {pageNumbers.map((number) => (
          <Button key={number} onClick={() => paginate(number)} variant={currentPage === number ? "contained" : "outlined"} color="primary" style={{ margin: "4px" }}>
            {number}
          </Button>
        ))}
        <Button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === pageNumbers.length} variant="contained" color="primary" style={{ margin: "4px" }}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default OrderTable;
