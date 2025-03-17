import React, { useEffect, useState } from "react";
import { Container, Table, Card, Spinner, Alert, Badge } from "react-bootstrap";
import { getRequestLogs, RequestLog } from "../services/logService";
import { format } from "date-fns";

export const RequestLogPage: React.FC = () => {
  const [requestLogs, setRequestLogs] = useState<RequestLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequestLogs = async () => {
      try {
        setLoading(true);
        const data = await getRequestLogs();
        setRequestLogs(data);
        setError(null);
      } catch (err) {
        setError("Greška pri dohvaćanju zapisa o zahtjevima.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestLogs();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd.MM.yyyy HH:mm:ss");
    } catch (error) {
      return "Neispravan datum";
    }
  };

  // Helper za određivanje boje badge-a ovisno o HTTP metodi
  const getMethodBadgeVariant = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "success";
      case "POST":
        return "primary";
      case "PUT":
        return "warning";
      case "DELETE":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Request logs</h4>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : requestLogs.length === 0 ? (
            <Alert variant="info">No logs available</Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Endpoint</th>
                    <th>Method</th>
                    <th>Time</th>
                    <th>IP Address</th>
                    <th>User</th>
                  </tr>
                </thead>
                <tbody>
                  {requestLogs.map((log, index) => (
                    <tr key={log.id}>
                      <td>{index + 1}</td>
                      <td>{log.endpoint}</td>
                      <td>
                        <Badge bg={getMethodBadgeVariant(log.method)}>
                          {log.method}
                        </Badge>
                      </td>
                      <td>{formatDate(log.timestamp)}</td>
                      <td>{log.ipAddress}</td>
                      <td>{log.username || "Unauthorized"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RequestLogPage;
