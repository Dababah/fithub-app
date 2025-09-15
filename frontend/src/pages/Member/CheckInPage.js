import React, { useState } from "react";
import { Container, Card, Button, Alert, Form } from "react-bootstrap";
import QrScanner from "../../components/dashboard/QrScanner";
import api from "../../services/api";

export default function CheckInPage() {
  const [msg, setMsg] = useState(null);
  const [manualToken, setManualToken] = useState("");

  async function handleScanToken(token) {
    if (!token) return;
    try {
      const res = await api.post("/attendance/checkin", { token });
      setMsg({
        type: "success",
        text:
          "✅ Checked in at " +
          new Date(res.data.data.checkInAt).toLocaleString(),
      });
    } catch (err) {
      setMsg({
        type: "danger",
        text: err?.response?.data?.message || "❌ Check-in failed",
      });
    }
  }

  async function handleManualSubmit(e) {
    e.preventDefault();
    if (manualToken.trim() !== "") {
      await handleScanToken(manualToken);
      setManualToken(""); // reset field
    }
  }

  return (
    <Container className="p-4">
      <h4>📷 Scan QR to Check-in</h4>
      <Card className="p-3">
        {msg && <Alert variant={msg.type}>{msg.text}</Alert>}

        {/* QR Scanner */}
        <QrScanner onScan={handleScanToken} />

        {/* Manual input (developer fallback) */}
        <Form onSubmit={handleManualSubmit} className="mt-3">
          <Form.Group>
            <Form.Label>Or paste QR token manually:</Form.Label>
            <Form.Control
              type="text"
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="Enter token"
            />
          </Form.Group>
          <Button type="submit" className="mt-2" variant="primary">
            Submit Token
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
