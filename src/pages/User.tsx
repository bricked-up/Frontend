import { Box, Button, TextField } from "@mui/material";
import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../Components/Header";

interface FormValues {
  username: string;
  email: string;
  profilePicture: string;
  organisations: string;
  projects: string;
}

const Form: React.FC = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    console.log(values);
    actions.setSubmitting(false);
  };

  return (
    <Box m="20px">
      <Header title="EDIT PROFILE" subtitle="Make Changes To Your Profile" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {/* Username Field */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={!!touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                sx={{ gridColumn: "span 2" }}
              />

              {/* Email Field */}
              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Profile Picture URL */}
              <TextField
                fullWidth
                variant="filled"
                type="url"
                label="Profile Picture URL"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.profilePicture}
                name="profilePicture"
                error={!!touched.profilePicture && !!errors.profilePicture}
                helperText={touched.profilePicture && errors.profilePicture}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Organisations Field */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Organisations"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.organisations}
                name="organisations"
                error={!!touched.organisations && !!errors.organisations}
                helperText={touched.organisations && errors.organisations}
                sx={{ gridColumn: "span 2" }}
              />

              {/* Projects Field */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Projects"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.projects}
                name="projects"
                error={!!touched.projects && !!errors.projects}
                helperText={touched.projects && errors.projects}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>

            {/* Submit Button */}
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Save Changes
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};
// Validation Schema
const checkoutSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  profilePicture: yup
    .string()
    .url("Invalid URL")
    .required("Profile Picture URL is required"),
  organisations: yup.string().required("Organisations are required"),
  projects: yup.string().required("Projects are required"),
});

// Initial Values
const initialValues: FormValues = {
  username: "",
  email: "",
  profilePicture: "",
  organisations: "",
  projects: "",
};

export default Form;
