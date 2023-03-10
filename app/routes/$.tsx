import ErrorPage from "~/components/ErrorPage";

export default function NotFoundRoute() {
  return <ErrorPage 
    code={404} 
    showGoToHome
    title="You have found a secret place." 
    subtitle="Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has been moved to another URL."
  />
}