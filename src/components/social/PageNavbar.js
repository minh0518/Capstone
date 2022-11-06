//Social페이지의 ShowPostsList페이지에서 기존에 작성된 Post들을 목록 형태로 보여주는데
//여기서 Post게시글이 많을 경우 페이징 처리를 하게 됩니다
//그 페이징 처리에서 사용되는 하단 버튼bar 입니다

import React from 'react'
import styled from 'styled-components'

const PageNavbar = ({ total, limit, page, setPage }) => {
  const Nav = styled.nav`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    margin: 16px;
  `

  const Button = styled.button`
    background-color: white;
    border: none;
    border-radius: 8px;
    padding: 8px;
    margin: 0;
    color: black;
    font-size: 1rem;

    &:hover {
      color: black;
      background: white;
      cursor: pointer;
      transform: translateY(-2px);
    }

    &[disabled] {
      background: grey;
      cursor: revert;
      transform: revert;
    }

    &[aria-current] {
      background: gray;
      font-weight: bold;
      cursor: revert;
      transform: revert;
    }
  `

  const numPages = Math.ceil(total / limit)

  return (
    <div>
      <Nav>
        <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
          &lt;
        </Button>
        {Array(numPages)
          .fill()
          .map((_, i) => (
            <Button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              aria-current={page === i + 1 ? 'page' : null}
            >
              {i + 1}
            </Button>
          ))}
        <Button onClick={() => setPage(page + 1)} disabled={page === numPages}>
          &gt;
        </Button>
      </Nav>
    </div>
  )
}

export default PageNavbar
