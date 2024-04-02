import React, { useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ToSAccordion = () => {
  const [accordionExpanded, setAccordionExpanded] = useState<string | false>(
    false
  );

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setAccordionExpanded(isExpanded ? panel : false);
    };

  return (
    <Box>
      <Typography
        component="h5"
        sx={{
          fontSize: "1rem",
          textAlign: "center",
          fontWeight: "bold",
          mt: 1,
          color: "warning.main",
        }}
      >
        Terms and Conditions
      </Typography>
      <Accordion
        expanded={accordionExpanded === "panel1"}
        onChange={handleAccordionChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography
            sx={{ width: "33%", flexShrink: 0, color: "warning.main" }}
          >
            Content
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ maxHeight: "50vh", overflowY: "scroll" }}>
          <Box>
            <Typography
              paragraph={true}
              align="justify"
              gutterBottom={true}
              sx={{ textIndent: "1rem" }}
            >
              Our Service allows You to post Content. You are responsible for
              the Content that You post to the Service, including its legality,
              reliability, and appropriateness.
            </Typography>
            <Typography
              paragraph={true}
              align="justify"
              gutterBottom={true}
              sx={{ textIndent: "1rem" }}
            >
              By posting Content to the Service, You grant Us the right and
              license to use, modify, publicly perform, publicly display,
              reproduce, and distribute such Content on and through the Service.
              You retain any and all of Your rights to any Content You submit,
              post or display on or through the Service and You are responsible
              for protecting those rights. You agree that this license includes
              the right for Us to make Your Content available to other users of
              the Service, who may also use Your Content subject to these Terms.
            </Typography>
            <Typography
              paragraph={true}
              align="justify"
              gutterBottom={true}
              sx={{ textIndent: "1rem" }}
            >
              You represent and warrant that: (i) the Content is Yours (You own
              it) or You have the right to use it and grant Us the rights and
              license as provided in these Terms, and (ii) the posting of Your
              Content on or through the Service does not violate the privacy
              rights, publicity rights, copyrights, contract rights or any other
              rights of any person.
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={accordionExpanded === "panel2"}
        onChange={handleAccordionChange("panel2")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography
            sx={{ width: "33%", flexShrink: 0, color: "warning.main" }}
          >
            Content Restrictions
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ maxHeight: "50vh", overflowY: "scroll" }}>
          <Typography
            paragraph={true}
            align="justify"
            gutterBottom={true}
            sx={{ textIndent: "1rem" }}
          >
            The Company is not responsible for the content of the Service's
            users. You expressly understand and agree that You are solely
            responsible for the Content and for all activity that occurs under
            your account, whether done so by You or any third person using Your
            account.
          </Typography>
          <Typography
            paragraph={true}
            align="justify"
            sx={{ textIndent: "1rem", marginBottom: 0 }}
          >
            You may not transmit any Content that is unlawful, offensive,
            upsetting, intended to disgust, threatening, libelous, defamatory,
            obscene or otherwise objectionable. Examples of such objectionable
            Content include, but are not limited to, the following:
          </Typography>
          <ul style={{ listStylePosition: "inside", marginTop: 0 }}>
            <li>Unlawful or promoting unlawful activity.</li>
            <li>
              Defamatory, discriminatory, or mean-spirited content, including
              references or commentary about religion, race, sexual orientation,
              gender, national/ethnic origin, or other targeted groups.
            </li>
            <li>
              Spam, machine – or randomly – generated, constituting unauthorized
              or unsolicited advertising, chain letters, any other form of
              unauthorized solicitation, or any form of lottery or gambling.
            </li>
            <li>
              Containing or installing any viruses, worms, malware, trojan
              horses, or other content that is designed or intended to disrupt,
              damage, or limit the functioning of any software, hardware or
              telecommunications equipment or to damage or obtain unauthorized
              access to any data or other information of a third person.
            </li>
            <li>
              Infringing on any proprietary rights of any party, including
              patent, trademark, trade secret, copyright, right of publicity or
              other rights.
            </li>
            <li>
              Impersonating any person or entity including the Company and its
              employees or representatives.
            </li>
            <li>Violating the privacy of any third person.</li>
            <li>False information and features.</li>
          </ul>
          <Typography
            paragraph={true}
            align="justify"
            gutterBottom={true}
            sx={{ marginTop: 2 }}
          >
            The Company reserves the right, but not the obligation, to, in its
            sole discretion, determine whether or not any Content is appropriate
            and complies with this Terms, refuse or remove this Content. The
            Company further reserves the right to make formatting and edits and
            change the manner of any Content. The Company can also limit or
            revoke the use of the Service if You post such objectionable
            Content.
          </Typography>
          <Typography
            paragraph={true}
            align="justify"
            gutterBottom={true}
            sx={{ textIndent: "1rem" }}
          >
            As the Company cannot control all content posted by users and/or
            third parties on the Service, you agree to use the Service at your
            own risk. You understand that by using the Service You may be
            exposed to content that You may find offensive, indecent, incorrect
            or objectionable, and You agree that under no circumstances will the
            Company be liable in any way for any content, including any errors
            or omissions in any content, or any loss or damage of any kind
            incurred as a result of your use of any content.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={accordionExpanded === "panel3"}
        onChange={handleAccordionChange("panel3")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography
            sx={{ width: "33%", flexShrink: 0, color: "warning.main" }}
          >
            Termination
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ maxHeight: "50vh", overflowY: "scroll" }}>
          <Typography
            paragraph={true}
            align="justify"
            gutterBottom={true}
            sx={{ textIndent: "1rem" }}
          >
            We may terminate or suspend Your Account immediately, without prior
            notice or liability, for any reason whatsoever, including without
            limitation if You breach these Terms of Service.
          </Typography>
          <Typography
            paragraph={true}
            align="justify"
            gutterBottom={true}
            sx={{ textIndent: "1rem" }}
          >
            Upon termination, Your right to use the Service will cease
            immediately. If You wish to terminate Your Account, You may simply
            discontinue using the Service.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ToSAccordion;
