#![deny(warnings)]

use hyper::service::{make_service_fn, service_fn};
use hyper::{Body, Method, Request, Response, Server, StatusCode};
use queryst::parse;

async fn echo(req: Request<Body>) -> Result<Response<Body>, hyper::Error> {
    let parsed = parse(req.uri().query().unwrap()).unwrap();
    match (req.method(), req.uri().path()) {
        (&Method::GET, "/echo") => Ok(Response::new(Body::from(parsed.to_string()))),
        (&Method::POST, "/echo") => Ok(Response::new(req.into_body())),
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

    let service = make_service_fn(|_| async { Ok::<_, hyper::Error>(service_fn(echo)) });

    let server = Server::bind(&addr).serve(service);

    println!("Listening on http://{}", addr);

    server.await?;

    Ok(())
}
