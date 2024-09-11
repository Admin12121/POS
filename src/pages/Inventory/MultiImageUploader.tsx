import './style.scss'

interface MultiImageUploaderProps {
    images: File[];
    setImages: any;
}

const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({ images, setImages }) => {

    const handleFileChange = (e:any) => {
      const files = Array.from(e.target.files);
  
      // Assuming you have set a maximum number of images allowed
      if (images.length + files.length > 5) {
        alert('Cannot upload more than 5 images.');
        return;
      }
  
      const imageFiles = files.filter((file:any) => file.type.startsWith('image/'));
      if (imageFiles.length === 0) {
        alert('Please select image files only.');
        return;
      }
      setImages((prevImages:any) => [...prevImages, ...imageFiles]);
    };
  
    const handleRemoveImage = (fileName:string) => {
      setImages((prevImages:any) => prevImages.filter((image:{name:string}) => image.name !== fileName));
    };

  return (
    <div className="upload__box">
    <div className="upload__btn-box">
      <label className="upload__btn">
        <p>Upload images</p>
            <input type="file" multiple onChange={handleFileChange} />
      </label>
    </div>
    <div className="upload__img-wrap">
      {images.map((image, index) => (
        <div key={index} className="upload__img-box">
          <div className="img-bg" style={{ backgroundImage: `url(${URL.createObjectURL(image)})` }}>
            <div className="upload__img-close" onClick={() => handleRemoveImage(image.name)}></div>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}

export default MultiImageUploader
