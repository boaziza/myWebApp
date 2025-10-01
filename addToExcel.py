import pandas as pd

excel_path = r'C:\Users\THANKPAD\.vscode\Sample\Extracting and appending\AdvaTech (3) (1).xlsx'

new_excel_path = r'C:\Users\THANKPAD\.vscode\Sample\Extracting and appending\new.xlsx'

df = pd.read_excel(excel_path,header=1)

date_column = "Date"  

df[date_column] = pd.to_datetime(df[date_column])

for day, group in df.groupby(df[date_column].dt.date):
    output = []  

    sp_card_amount = 0
    momo_amount = 0
    cash_amount = 0
    bank_card_amount = 0
    diesel_amount = 0
    essence_amount = 0
    
    for (payment_type,product_type), payment_group in group.groupby(["Payment","Product"]):
        total_amount = payment_group["Amount"].sum()

        if product_type == "ESSENCE":
            essence_amount += total_amount
        else:
            diesel_amount += total_amount

        output.append(payment_group)
        
        total_row = pd.DataFrame({
            "Volume": ["Total"],
            "Amount": [total_amount]
        })
        output.append(total_row)

        if payment_type == 'CASH':
            cash_amount += total_amount

        elif payment_type == 'BANK CARD':
            bank_card_amount += total_amount

        elif payment_type == 'SP FUEL CARD':
            sp_card_amount += total_amount
             
        elif payment_type == 'MTN MOMO':   
            momo_amount += total_amount

        output.append(pd.DataFrame({date_column: [""]}))
    
    summary_payment = pd.DataFrame({
        date_column :["Payments Summary"],
        "Customer" :["Vente Cash"],
        "Price" : [cash_amount]
    })

    output.append(summary_payment)

    summary_payment1 = pd.DataFrame({
        date_column :[" "],
        "Customer" :["Vente MTN MOMO"],
        "Price" : [momo_amount]
    })

    output.append(summary_payment1)

    summary_payment2 = pd.DataFrame({
        date_column :[" "],
        "Customer" :["Vente BANK CARD"],
        "Price" : [bank_card_amount]
    })

    output.append(summary_payment2)

    summary_payment3 = pd.DataFrame({
        date_column :[" "],
        "Customer" : ["Vente SP FUEL CARD"],
        "Price" : [sp_card_amount]
    })

    output.append(summary_payment3)

    total_payments = pd.DataFrame({
        date_column :["Total payments"],
        "Customer" : [sp_card_amount+ momo_amount + cash_amount + bank_card_amount]
    })

    output.append(total_payments)

    
    space = pd.DataFrame({
        date_column : [""]
    })

    output.append(space)

    product_title = pd.DataFrame({
        date_column : ["Product"],
        "Customer" : ["Amount"]
    })

    output.append(product_title)

    product_amount = pd.DataFrame({
        date_column : ["Diesel"],
        "Customer" : [diesel_amount]
    })

    output.append(product_amount)

    product_amount2 = pd.DataFrame({
        date_column : ["Essence"],
        "Customer" : [essence_amount]
    })

    output.append(product_amount2)

    # Combine all parts into one DataFrame
    final_df = pd.concat(output, ignore_index=True)
    # remise_df = pd.concat(remise, ignore_index=True)
    
    filename = fr"C:\Users\THANKPAD\.vscode\Sample\Extracting and appending\{day}.xlsx"
    # remise_filename = fr"C:\Users\THANKPAD\.vscode\Sample\Test1\remise_{day}.xlsx"
    final_df.to_excel(filename, index=False)
    # remise_df.to_excel(remise_filename, index=False)
    print(f"Saved {filename}")


