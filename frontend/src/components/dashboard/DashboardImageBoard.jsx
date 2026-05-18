export default function DashboardImageBoard({ line }) {
  return (
    <div className="dashboard-image-page">
      {/* <div className="dashboard-image-topline">
        <div>
          <h1>{line.code} PART REFERENCE</h1>
          <p>Uploaded from Production Update</p>
        </div>
      </div> */}
      <div className="dashboard-image-stage">
        {line.partImageSrc ? (
          <img src={line.partImageSrc} alt="Uploaded part reference" />
        ) : (
          <div className="dashboard-image-empty">
            <i className="ti ti-photo-off" />
            <strong>No uploaded image</strong>
            <span>Upload image from Production Update first.</span>
          </div>
        )}
      </div>
    </div>
  );
}
