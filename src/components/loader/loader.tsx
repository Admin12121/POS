import style from './style.module.scss'
const Loader = ({login}:{login?:any}) => {
  return (
    <>
    <div className={style.loader_wrapper} style={{height:`${login ? "100%" : "100vh"} `, width:`${login ? "100%" : "100vw"} `}}>
    <svg className={style.Loader} viewBox="25 25 50 50">
        <circle className={style.comp} r="20" cy="50" cx="50"></circle>
      </svg>
    </div>
    </>
  );
};

export default Loader;
