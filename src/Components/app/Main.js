import RouteChangeTracker from "../router/RouteChangeTracker";
import Router from "../router/Router"

function Main() {
  RouteChangeTracker();
	return (
		<main>
          <div className="py-4">
            <div className="container">
              <Router></Router>
            </div>
          </div>
        </main>
	);
}

export default Main;