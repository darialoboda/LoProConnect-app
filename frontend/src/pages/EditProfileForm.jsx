import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Card, Typography, Box } from "@mui/material";

const EditProfileForm = ({ initialValues, onSubmit, onCancel }) => {
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      name: Yup.string().required("Meno je povinné"),
      email: Yup.string().email("Nesprávny email").required("Email je povinný"),
     
      password: Yup.string()
        .min(8, "Heslo musí mať aspoň 8 znakov")
        .matches(/^(?=.*[A-Z])(?=.*\d)/, "Heslo musí obsahovať aspoň jedno veľké písmeno a číslo"),
    }),
    onSubmit,
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#00000080",
        padding: 3,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          padding: 4,
          borderRadius: 3,
          boxShadow: 8,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          color: "#fff",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.6)",
          }}
        >
          Úprava profilu
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 2,
            }}
          >
            <TextField
              fullWidth
              label="Meno"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              InputLabelProps={{
                style: { color: "#fff", fontWeight: "bold" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              InputLabelProps={{
                style: { color: "#fff", fontWeight: "bold" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              fullWidth
              label="Nové heslo (voliteľné)"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputLabelProps={{
                style: { color: "#fff", fontWeight: "bold" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  borderRadius: 2,
                },
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              mt: 3,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#FFC107",
                color: "#000",
                padding: "10px 20px",
                borderRadius: 3,
                "&:hover": {
                  backgroundColor: "#FFB300",
                },
              }}
            >
              Uložiť
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#fff",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: 3,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
              onClick={onCancel}
            >
              Zrušiť
            </Button>
          </Box>
        </form>
      </Card>
    </Box>
  );
};

export default EditProfileForm;
