import { useEffect, useState } from 'react';

interface Product {
  id: number;
  product_name: string;
  single_product?: {
    price: number;
  };
  variant?: {
    id:number
    price: number;
  };
}

interface BillItem {
  product_id: number;
  product_name: string;
  product_price: number;
  pcs: number;
  total: number;
}

interface CalculateProps {
  setBillDetails: any;
  setBillUser: (user: any) => void;
  billDetails: BillItem[];
  disfromredem: any;
  selectedItems: Product[];
  pcs: { [key: string]: number };
  tax: string;
  discount: number;
  shipping: number;
  totalPrice: number;
  setTotalPrice: (price: number) => void;
}

const Calculate = ({
  setBillDetails,
  setBillUser,
  disfromredem,
  selectedItems,
  pcs,
  tax,
  discount,
  shipping,
  totalPrice,
  setTotalPrice,
}: CalculateProps) => {
  const [subtotalPrice, setSubTotalPrice] = useState<number>(0);
  const [disAmt, setDisAmt] = useState<number>(0);
  const [subtotalafterdis, setSubTotalAfterDis] = useState<number>(0);
  const [taxAmt, setTaxAmt] = useState<number>(0);

  useEffect(() => {
    let tempBillDetails: BillItem[] = [];
    let tempTotalPrice = 0;
    Object.entries(pcs).forEach(([key, quantity]) => {
      const [productId, variantId] = key.split('-').map(Number);
      const product = selectedItems.find((item) => item.id === productId && (!variantId || item.variant?.id === variantId));
      if (product) {
        const price = product.single_product?.price || product.variant?.price || 0;
        const total = price * quantity;
        tempTotalPrice += total;
        const billItem: BillItem = {
          product_id: product.id,
          product_name: product.product_name,
          ...(product.variant && { varient_id: product.variant.id }),
          product_price: price,
          pcs: quantity,
          total: total,
        };

        tempBillDetails.push(billItem);
      }
    });

    setBillDetails(tempBillDetails);
    setSubTotalPrice(tempTotalPrice);
  }, [selectedItems, pcs, setBillDetails]);


  useEffect(() => {
    if (discount > 0) {
      const discamt = (discount / 100) * subtotalPrice;
      setDisAmt(parseFloat(discamt.toFixed(3)));
      setSubTotalAfterDis(subtotalPrice - discamt);
    } else {
      setDisAmt(0);
      setSubTotalAfterDis(subtotalPrice);
    }

    let tempTotalPrice = subtotalafterdis;
    if (shipping > 0) {
      tempTotalPrice += Number(shipping);
    }
    if (tax === 'Include') {
      const taxamt = 0.13 * subtotalafterdis;
      setTaxAmt(parseFloat(taxamt.toFixed(3)));
      tempTotalPrice += taxamt;
    } else {
      setTaxAmt(0);
      setTotalPrice(tempTotalPrice);
    }

    const updatedBillDetails = {
      sub_total: subtotalPrice,
      discount: disAmt,
      shipping: shipping,
      tax: taxAmt,
      total: tempTotalPrice,
    };

    setBillUser(updatedBillDetails);
    setTotalPrice(parseFloat(tempTotalPrice.toFixed(3)));
  }, [tax, discount, selectedItems, pcs, subtotalPrice, subtotalafterdis, shipping, taxAmt, setBillUser, setTotalPrice]);

  return (
    <div className='Calculate_user_total'>
      <table>
        <tbody>
          <tr>
            <th>Sub Total</th>
            <td>रू {subtotalPrice}</td>
          </tr>
          <tr>
            <th>Tax {`${tax === 'Include' ? `(Include 13%)` : `(Exclude)`}`}</th>
            <td>रू {taxAmt}</td>
          </tr>
          <tr>
            <th>Shipping</th>
            <td>रू {shipping <= 0 ? 0 : shipping}</td>
          </tr>
          <tr>
            <th className='dis'>Discount {`(${discount}%)`}</th>
            <td className='dis'>रू {disAmt}</td>
          </tr>
        </tbody>
      </table>
      <table className='total_amt_display' style={{ padding: '10px 5%' }}>
        <tbody>
          <tr>
            <th>Total</th>
            <td>रू {totalPrice}</td>
          </tr>
          {disfromredem && (
            <tr>
              <th className='dis'>
                Redeem Code {disfromredem.dis ? `(${disfromredem.dis}%)` : ''}
              </th>
              <td className='dis'>रू {disfromredem.disval}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Calculate;