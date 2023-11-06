import { useEffect, useState } from "react";
import IDataList from "../model/IDataList";
import { getDataFromServer } from "../services/menu";
import ExpenseTracker from "./ExpenseTracker";

function ShowData() {
  const [items, setItems] = useState<IDataList[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [sum, setSum] = useState<number | null>();
  const [buddyspent, setbuddyspent] = useState<number>(0);
  const [buddy2spent, setbuddy2spent] = useState<number>(0);
  const [showform, setShowForm] = useState<boolean>(false);

  var buddyspent1: number = 0;
  var buddy2spent1: number = 0;

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getDataFromServer();
        setItems(data);
        setSum(data.reduce((result, v) => (result = result + v.price), 0));
        Shares(data);
      } catch (error: any) {
        setError(error);
      }
    };
    fetchMenu();
  }, [showform]);

  const Shares = (data: IDataList[]) => {
    data.map((sams) =>
      sams.payeeName === "buddy"
        ? (buddyspent1 = buddyspent1 + sams.price)
        : (buddy2spent1 = buddy2spent1 + sams.price)
    );
    setbuddyspent(buddyspent1);
    setbuddy2spent(buddy2spent1);
  };

  const success = () => {
    setShowForm(false);
  };
  const cancel = () => {
    setShowForm(false);
  };

  return (
    <>
      <header id="page-Header">Expense Tracker</header>
      <button id="Add-Button" onClick={() => setShowForm(true)}>
        Add
      </button>
      {showform && (
        <div className="form">
          <ExpenseTracker onTrue={success} onClose={cancel} />
        </div>
      )}
      <>
        <div className="use-inline date header-color">Date</div>
        <div className="use-inline header-color">Product Purchased</div>
        <div className="use-inline price header-color">Price</div>
        <div className="use-inline header-color" style={{ width: 112 }}>
          Payee
        </div>
      </>
      {items &&
        items.map((user, idx) => (
          <div key={idx}>
            <div className="use-inline date">{user.setDate}</div>
            <div className="use-inline">{user.product}</div>
            <div className="use-inline price">{user.price}</div>
            <div className={`use-inline ${user.payeeName}`}>
              {user.payeeName}
            </div>
          </div>
        ))}
      <hr />
      <div className="use-inline ">Total: </div>
      <span className="use-inline total">{sum}</span> <br />
      <div className="use-inline ">buddy paid: </div>
      <span className="use-inline total buddy">{buddyspent}</span> <br />
      <div className="use-inline ">buddy2 paid: </div>
      <span className="use-inline total buddy2">{buddy2spent}</span> <br />
      <span className="use-inline payable">
        {buddyspent > buddy2spent ? "Pay buddy " : "Pay buddy2"}
      </span>
      <span className="use-inline payable price">
        {" "}
        {Math.abs((buddyspent - buddy2spent) / 2)}
      </span>
      {error && <>{error?.message}</>}
    </>
  );
}
export default ShowData;
