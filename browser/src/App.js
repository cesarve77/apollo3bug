import {gql, useQuery} from '@apollo/client';
import {useRef} from "react";


const QUERY = gql`query Books($skip: Int) {
    books (skip: $skip) {
        id
        author
        title
    }
}
`

function App() {
    const skip = useRef(0);
    const {data, fetchMore, variables} = useQuery(QUERY, {variables: {skip: skip.current}})
    return (<>
            <table>
                <thead>
                <tr>
                    <th>title</th>
                    <th>author</th>
                </tr>
                </thead>
                <tbody>
                {data?.books?.map(book => <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                </tr>)}
                </tbody>
            </table>
            <button onClick={() => {
                skip.current = skip.current >= 10 ? skip.current - 10 : skip.current
                fetchMore({
                    variables: {
                        skip: skip.current
                    }
                })
            }}> {'<'}</button>
            <button onClick={() => {
                skip.current = skip.current + 10

                fetchMore({
                    variables: {
                        skip: skip.current + 10
                    }
                })
            }}> >
            </button>
        </>

    );
}

export default App;
