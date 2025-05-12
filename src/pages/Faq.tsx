import React from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Paper,
  useTheme,
  useMediaQuery,
  Divider,
  alpha,
} from "@mui/material";
import { ExpandMore, HelpOutline, Person } from "@mui/icons-material";
import { motion } from "framer-motion";

// Sample FAQ data
const FAQ_DATA = [
  {
    icon: <HelpOutline />,
    section: "General Questions",
    items: [
      {
        question: "What can i do if my account is blocked?",
        answer:
          "If your account has been blocked or suspended, it may be due to unusual activity, a violation of our terms of service, or a security concern. To resolve the issue, please contact our support team by emailing support@brickedup.com. Include your registered email address and any relevant details. Our team will review your case and get back to you within 1-2 business days.",
      },
      {
        question: "Can i verify my account through email?",
        answer:
          "Yes, absolutely. During the registration process, we send a verification link to your registered email address. Simply open that email and click on the verification link to confirm your account. If you didn't receive the email, check your spam folder or try again after 2-3 minutes.",
      },
      {
        question: "How do I reset my password?",
        answer:
          "To reset your password, go to the login page and click on Forgot Password. You'll be prompted to enter your registered email address. We'll send you a secure link to create a new password. If you don't receive the email within a few minutes, be sure to check your spam or junk folder.",
      },
      {
        question: "Can I change my username?",
        answer:
          "Yes, you can change your email address at any time. Simply log in to your account, go to View Your Profile, and click on your name to make the change. ",
      },
    ],
  },
];
const Faq: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expanded, setExpanded] = React.useState<string | false>(false);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isDark = theme.palette.mode === "dark";

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
        background: isDark
          ? "linear-gradient(135deg, #0f172a, #1e293b, #334155)"
          : "linear-gradient(135deg, #f8fafc, #e2e8f0, #cbd5e1)",
        color: isDark ? "#f1f5f9" : "#1e293b",
        pt: 2,
        pb: 8,
        overflowY: "auto",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ position: "relative", overflow: "visible" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ width: "100%" }}
        >
          <Paper
            elevation={8}
            sx={{
              backdropFilter: "blur(16px)",
              background: isDark
                ? "rgba(30, 41, 59, 0.7)"
                : "rgba(255, 255, 255, 0.7)",
              borderRadius: 6,
              p: { xs: 3, md: 6 },
              width: "100%",
              textAlign: "center",
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.1)",
              transition: "all 0.4s ease-in-out",
              my: 4,
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <HelpOutline
                  sx={{
                    fontSize: { xs: 50, md: 70 },
                    color: "#38bdf8",
                    filter: "drop-shadow(0 0 10px rgba(56, 189, 248, 0.4))",
                  }}
                />
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: isDark ? "#f1f5f9" : "#0f172a",
                  mb: 2,
                }}
              >
                Help Center
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{
                  opacity: 0.85,
                  color: isDark ? "#cbd5e1" : "#475569",
                  maxWidth: "700px",
                  mx: "auto",
                  mb: 4,
                }}
              >
                Everything you need to know, answered in one place. Browse
                through our comprehensive FAQ to find solutions quickly.
              </Typography>

              <Divider
                sx={{
                  my: 5,
                  borderColor: alpha(isDark ? "#f1f5f9" : "#0f172a", 0.1),
                }}
              />
            </motion.div>

            {FAQ_DATA.map(
              (
                section: {
                  icon: React.FunctionComponentElement<{
                    sx: { color: string; fontSize: number };
                  }>;
                  section:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                        unknown,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  items: any[];
                },
                sectionIndex: React.Key | null | undefined
              ) => (
                <motion.div
                  key={sectionIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.4 + (Number(sectionIndex) || 0) * 0.1,
                    duration: 0.6,
                  }}
                >
                  <Box sx={{ mt: 5, mb: 4, textAlign: "left" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: alpha("#38bdf8", 0.15),
                          borderRadius: "12px",
                          p: 1.5,
                          width: 48,
                          height: 48,
                        }}
                      >
                        {React.cloneElement(section.icon, {
                          sx: { color: "#38bdf8", fontSize: 28 },
                        })}
                      </Box>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: isDark ? "#f8fafc" : "#0f172a",
                        }}
                      >
                        {section.section}
                      </Typography>
                    </Box>

                    {section.items.map(
                      (
                        item: {
                          question:
                            | string
                            | number
                            | bigint
                            | boolean
                            | React.ReactElement<
                                unknown,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | Promise<
                                | string
                                | number
                                | bigint
                                | boolean
                                | React.ReactPortal
                                | React.ReactElement<
                                    unknown,
                                    string | React.JSXElementConstructor<any>
                                  >
                                | Iterable<React.ReactNode>
                                | null
                                | undefined
                              >
                            | null
                            | undefined;
                          answer:
                            | string
                            | number
                            | bigint
                            | boolean
                            | React.ReactElement<
                                unknown,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | Promise<
                                | string
                                | number
                                | bigint
                                | boolean
                                | React.ReactPortal
                                | React.ReactElement<
                                    unknown,
                                    string | React.JSXElementConstructor<any>
                                  >
                                | Iterable<React.ReactNode>
                                | null
                                | undefined
                              >
                            | null
                            | undefined;
                        },
                        i: React.Key | null | undefined
                      ) => {
                        const panelId = `panel-${sectionIndex}-${i}`;
                        return (
                          <motion.div
                            key={i}
                            whileHover={{ x: 8 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 20,
                            }}
                          >
                            <Accordion
                              expanded={expanded === panelId}
                              onChange={handleChange(panelId)}
                              disableGutters
                              sx={{
                                background: "transparent",
                                boxShadow: "none",
                                mb: 2,
                              }}
                            >
                              <AccordionSummary
                                expandIcon={
                                  <ExpandMore
                                    sx={{
                                      color:
                                        expanded === panelId
                                          ? "#38bdf8"
                                          : alpha(
                                              isDark ? "#f1f5f9" : "#0f172a",
                                              0.7
                                            ),
                                      transition: "all 0.3s",
                                    }}
                                  />
                                }
                                sx={{
                                  background:
                                    expanded === panelId
                                      ? alpha("#0ea5e9", 0.1)
                                      : alpha(
                                          isDark ? "#ffffff" : "#000000",
                                          0.05
                                        ),
                                  borderRadius: 3,
                                  py: 1.5,
                                  px: 3,
                                  minHeight: "64px",
                                  transition: "all 0.3s",
                                  borderLeft: `3px solid ${
                                    expanded === panelId
                                      ? "#38bdf8"
                                      : "transparent"
                                  }`,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 600,
                                    color:
                                      expanded === panelId
                                        ? isDark
                                          ? "#f8fafc"
                                          : "#0f172a"
                                        : alpha(
                                            isDark ? "#f1f5f9" : "#0f172a",
                                            0.9
                                          ),
                                  }}
                                >
                                  {item.question}
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails
                                sx={{
                                  px: { xs: 2, md: 4 },
                                  py: 3,
                                  borderLeft: `3px solid #38bdf8`,
                                  marginLeft: 3,
                                  marginRight: 2,
                                  background: alpha(
                                    isDark ? "#0f172a" : "#e2e8f0",
                                    0.4
                                  ),
                                  borderRadius: "0 0 16px 0",
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  sx={{
                                    color: alpha(
                                      isDark ? "#f1f5f9" : "#0f172a",
                                      0.8
                                    ),
                                    lineHeight: 1.8,
                                    letterSpacing: 0.3,
                                  }}
                                >
                                  {item.answer}
                                </Typography>
                              </AccordionDetails>
                            </Accordion>
                          </motion.div>
                        );
                      }
                    )}
                  </Box>
                </motion.div>
              )
            )}

            <Divider
              sx={{
                my: 5,
                borderColor: alpha(isDark ? "#f1f5f9" : "#0f172a", 0.1),
              }}
            />
          </Paper>
        </motion.div>

        <Box
          component="footer"
          sx={{
            textAlign: "center",
            py: 2,
            fontSize: "0.9rem",
            opacity: 0.4,
            color: isDark ? "#94a3b8" : "#475569",
            borderTop: `1px solid ${alpha(
              isDark ? "#f1f5f9" : "#0f172a",
              0.1
            )}`,
            mt: 4,
          }}
        >
          © 2025 Company, Inc. · Privacy · Terms
        </Box>
      </Container>
    </Box>
  );
};

export default Faq;
