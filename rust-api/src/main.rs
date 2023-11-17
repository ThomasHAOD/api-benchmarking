#![deny(warnings)]
use hyper::service::{make_service_fn, service_fn};
use hyper::{Body, Method, Request, Response, Server, StatusCode};
use queryst::parse;
use serde::Deserialize;
use tokio_postgres::{Error, NoTls};
#[derive(Clone, Debug, Deserialize, serde::Serialize)]
struct Driver {
    driver_id: i32,
    driver_ref: String,
    number: Option<i32>,
    code: Option<String>,
    forename: String,
    surname: String,
    nationality: Option<String>,
    url: String,
}
async fn get_drivers() -> Result<String, Error> {
    let (client, connection) =
        tokio_postgres::connect("postgresql://user:password@localhost:54321/database", NoTls)
            .await?;

    // The connection object performs the actual communication with the database,
    // so spawn it off to run on its own.
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });
    let rows: Vec<tokio_postgres::Row> = client.query("SELECT * FROM drivers", &[]).await?;
    let drivers: Vec<Driver> = serde_postgres::from_rows(&rows).unwrap();
    Ok(serde_json::to_string(&drivers).unwrap())
}

fn get_query_string(req: Request<Body>) -> String {
    return parse(req.uri().query().unwrap()).unwrap().to_string();
}

async fn endpoints(req: Request<Body>) -> Result<Response<Body>, hyper::Error> {
    match (req.method(), req.uri().path()) {
        (&Method::GET, "/echo") => Ok(Response::new(Body::from(get_query_string(req)))),
        (&Method::POST, "/echo") => Ok(Response::new(req.into_body())),
        (&Method::GET, "/etl") => Ok(Response::new(Body::from(get_drivers().await.unwrap()))),
        _ => {
            let mut not_found = Response::default();
            *not_found.status_mut() = StatusCode::NOT_FOUND;
            Ok(not_found)
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let addr = ([0, 0, 0, 0], 3005).into();

    let service = make_service_fn(|_| async { Ok::<_, hyper::Error>(service_fn(endpoints)) });

    let server = Server::bind(&addr).serve(service);

    println!("Listening on http://{}", addr);

    server.await?;

    Ok(())
}
