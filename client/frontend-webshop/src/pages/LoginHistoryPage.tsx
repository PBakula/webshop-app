import React, { useEffect, useState } from "react";
import { Container, Table, Card, Spinner, Alert } from "react-bootstrap";
import { getLoginHistory, LoginHistory } from "../services/logService";
import { format } from "date-fns";

export const LoginHistoryPage: React.FC = () => {
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoginHistory = async () => {
      try {
        setLoading(true);
        const data = await getLoginHistory();
        setLoginHistory(data);
        setError(null);
      } catch (err) {
        setError("Error fetching login history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoginHistory();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd.MM.yyyy HH:mm:ss");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Login history</h4>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : loginHistory.length === 0 ? (
            <Alert variant="info">No history logs available.</Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Time</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {loginHistory.map((log, index) => (
                    <tr key={log.id}>
                      <td>{index + 1}</td>
                      <td>
                        {log.userFirstName} {log.userLastName}{" "}
                      </td>
                      <td>{log.userEmail}</td>
                      <td>{formatDate(log.timestamp)}</td>
                      <td>{log.ipAddress}</td>
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

export default LoginHistoryPage;
