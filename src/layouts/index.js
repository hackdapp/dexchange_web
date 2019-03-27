import Header from '../components/Common/Header.js';
import Footer from '../components/Common/Footer.js';
import styles from './index.css'
function BasicLayout(props) {
  return (
    <div>
      <Header></Header>
      <div className={styles.indexDetails}>
        {props.children}
      </div>
      <Footer></Footer>
    </div>
  );
}

export default BasicLayout;
