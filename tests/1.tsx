//TSTypeAlias
type IProps = { info: String; s: string, p: { a: Object } }

//TSInterface
interface AA {
    a: string,
    b: IProps
}

function CmpA(props:IProps) {
    return <h1>this is a</h1>
}


function CmpB() {
    /**
     * 
     * @param props asd
     * @returns 
     */
    const InnerCmp = function (props: IProps) {
        return <div>inner</div>
    }
    return <h1>
        this is a
        <InnerCmp info={"a"} p={{a: 1}} s={"aa"}/>
    </h1>
}

function fn2() {
    return 123
}

/**
 * aa
 */
const AA = function(){
    
}


const CompArr = (props:{a:boolean})=>{

}


export default function (props: AA) {
    return <div>aaa</div>;
}
