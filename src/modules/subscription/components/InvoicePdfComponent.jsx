import { MdOutlineFileDownload } from "react-icons/md";
import Pdf from "react-to-pdf";

export const Pdfhtml = (props) => {
  return (
    <>
      <Pdf targetRef={props.myRef} filename="code-example.pdf">
        {({ toPdf }) => (
          <div className="d-flex justify-content-end">
            <a
              // href={
              //   "https://kaiwa-api.dev.weconnect.chat/api/admin/printinvoice?id=" +
              //   this.state.invoiceId
              // }
              // target="_blank"
              className="btn btn-success"
              onClick={toPdf}
              style={{
                fontFamily: "Nunito",
              }}
            >
              <MdOutlineFileDownload />
              Download Pdf
            </a>
          </div>
        )}
      </Pdf>
      <div
        style={{
          width: "780px",
          backgroundColor: "#fff",
          padding: "10px",
        }}
        ref={props.myRef}
      >
        <table style={{ width: "100%" }}>
          <tr>
            <th
              style={{
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: "30px",
                fontWeight: "bold",
                textDecoration: "underline",
              }}
              colSpan="3"
            >
              INVOICE
            </th>
          </tr>
          <tr>
            <th colSpan="3">
              <img
                src="https://weconnect.leocoders.com/static/media/logo.08d3b0a06a8a54e942d0.png"
                style={{
                  width: "180px",
                  marginBottom: "20px",
                }}
              />
            </th>
          </tr>
        </table>
        <table style={{ width: "100%" }}>
          <tr>
            <td
              rowSpan="3"
              style={{
                width: "50%",
                borderBottom: "1px solid black",
                fontFamily: "Nunito",
              }}
            >
              WeConnect.Chat, Portland 66, 1046 BD, Amsterdam, Netherlands
              <br />
              {props.data.bill_to
                ? props.data.bill_to
                    .split(",")
                    .map((data, i) => (
                      <p>
                        {data +
                          (i == props.data.bill_to.split(",").length - 1
                            ? "."
                            : ",")}
                      </p>
                    ))
                : ""}
              {/* <br /> Portland 66, 1046 BD,
              <br /> Amsterdam,
              <br /> Netherlands */}
            </td>
            <th
              style={{
                backgroundColor: "#f1f1f1",
                paddingLeft: "10px",
                fontFamily: "Nunito",
              }}
            >
              Invoice Number:
            </th>
            <td
              style={{
                backgroundColor: "#f1f1f1",
                fontFamily: "Nunito",
              }}
            >
              {props.data.invoice_number}
            </td>
          </tr>
          <tr>
            <th
              style={{
                backgroundColor: "#f1f1f1",
                paddingLeft: "10px",
                fontFamily: "Nunito",
              }}
            >
              Invoice Date:
            </th>
            <td
              style={{
                backgroundColor: "#f1f1f1",
                fontFamily: "Nunito",
              }}
            >
              {props.data.invoice_date}
            </td>
          </tr>
          <tr>
            <th
              style={{
                backgroundColor: "#f1f1f1",
                paddingLeft: "10px",
                fontFamily: "Nunito",
              }}
            >
              Next Payment Date:
            </th>
            <td
              style={{
                backgroundColor: "#f1f1f1",
                fontFamily: "Nunito",
              }}
            >
              {props.data.billing_date}
            </td>
          </tr>
        </table>
        <table
          style={{
            width: "100%",
            marginTop: "20px",
            borderBottom: "1px solid black",
            fontFamily: "Nunito",
          }}
        >
          <tr>
            <th colSpan="3">Bill To:</th>
          </tr>
          <tr>
            <td colSpan="3">Studytube</td>
          </tr>
          <tr>
            <td colSpan="3">Studytube</td>
          </tr>
          <tr>
            <td colSpan="3">aritaweg 70 1043 BZ Amsterdam</td>
          </tr>
        </table>
        <table style={{ width: "100%", marginTop: "20px" }}>
          <tr>
            <th colSpan="3">Contact</th>
          </tr>
          <tr>
            <td colSpan="3">
              <a href="#">https://weconnect.chat</a>
            </td>
          </tr>
        </table>
        <table
          style={{
            width: "100%",
            border: "1px solid black",
          }}
        >
          <tr>
            <th style={{ border: "1px solid black", fontFamily: "Nunito" }}>
              Item description
            </th>
            <th style={{ border: "1px solid black", fontFamily: "Nunito" }}>
              Ordered Oty
            </th>
            <th style={{ border: "1px solid black", fontFamily: "Nunito" }}>
              Unit Price
            </th>
            <th style={{ border: "1px solid black", fontFamily: "Nunito" }}>
              Extended Price
            </th>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", fontFamily: "Nunito" }}>
              {props.data.plan_name}
            </td>
            <td style={{ border: "1px solid black", fontFamily: "Nunito" }}>
              {props.data.ordered_qty}
            </td>
            <td style={{ border: "1px solid black", fontFamily: "Nunito" }}>
              {props.data.unit_price}
            </td>
            <td style={{ border: "1px solid black", fontFamily: "Nunito" }}>
              {props.data.extended_price}
            </td>
          </tr>
        </table>
        <table style={{ width: "100%", marginTop: "100px" }}>
          <tr>
            <td rowSpan="3" style={{ width: "50%" }}></td>
            <th
              style={{
                backgroundColor: "#f1f1f1",
                paddingLeft: "10px",
                fontFamily: "Nunito",
              }}
            >
              NET TOTAL:
            </th>
            <td
              style={{
                backgroundColor: "#f1f1f1",
                fontFamily: "Nunito",
              }}
            >
              €{props.data.total_price}
            </td>
          </tr>
          <tr>
            <th
              style={{
                backgroundColor: "#f1f1f1",
                paddingLeft: "10px",
                fontFamily: "Nunito",
              }}
            >
              VAT (Netherlands) 21%:
            </th>
            <td
              style={{
                backgroundColor: "#f1f1f1",
                fontFamily: "Nunito",
              }}
            >
              €{props.data.VAT_to_pay}
            </td>
          </tr>
          <tr>
            <th
              style={{
                backgroundColor: "#f1f1f1",
                fontFamily: "Nunito",
                paddingLeft: "10px",
              }}
            >
              TOTAL:
            </th>
            <td
              style={{
                backgroundColor: "#f1f1f1",
                fontFamily: "Nunito",
              }}
            >
              €{props.data.total_price}
            </td>
          </tr>
        </table>
      </div>
    </>
  );
};
