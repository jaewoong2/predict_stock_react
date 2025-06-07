import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div>
      <h1>404 - 페이지를 찾을 수 없습니다</h1>
      <Link to="/">홈으로 돌아가기</Link>
    </div>
  );
}

export default NotFound;
