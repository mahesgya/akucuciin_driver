import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import driverService from "../../services/driverService";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Select, MenuItem, Button } from "@mui/material";
import { Box, Card, CardContent, CardActions, Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Swal from "sweetalert2";

const HomePage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editedData, setEditedData] = useState({ status: "" });

  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    const fetchSessions = async () => {
        const response = await driverService.getOrderDriver(accessToken);
        setSessions(response.data);
        setLoading(false);
    };

    fetchSessions();
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
    }
  };

  const handleChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sessions.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(sessions.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }


  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Selamat Datang di Dashboard Driver!
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Hari ini: <strong>{new Date().toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}</strong>
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Jumlah pesanan hari ini: <strong>{sessions.length}</strong>
      </Typography>

      <Box mt={4} p={3} borderRadius={2} >
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          ORDER AKUCUCIIN HARI INI
        </Typography>

        {currentItems.map((item, index) => (
        <Card key={item.id} style={{ width: "100%", }}>
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
              <CardActions display="flex" justify="end" items="center">
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

        <Box mt={3} display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          {pageNumbers.map((number) => (
            <Button
              key={number}
              variant={currentPage === number ? "contained" : "outlined"}
              color="primary"
              onClick={() => paginate(number)}
            >
              {number}
            </Button>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === pageNumbers.length}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
