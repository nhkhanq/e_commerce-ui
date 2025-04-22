const LoadingPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <img
        src="./public/loading.gif"
        height={150}
        width={150}
        alt="Loading..."
      />
    </div>
  );
};

export default LoadingPage;
