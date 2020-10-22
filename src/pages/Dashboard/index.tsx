import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const {transactions, balance} = await (await api.get('/transactions')).data
      
      const formattedTransactions = transactions.map((transaction:Transaction)=>({
        ...transaction,
        formattedValue: formatValue(transaction.value),
        formattedDate: new Date(transaction.created_at).toLocaleDateString('pt-BR')
      }))
      // const formattedBalance = {
      //   income:formatValue(balance.income),
      //   outcome:formatValue(balance.outome),
      //   total:formatValue(balance.total)
      // }
      
      // console.log(formattedBalance.o)
      setTransactions(formattedTransactions)
      setBalance(balance)
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header page="dashboard"/>
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{formatValue(balance.income)}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{formatValue(balance.outcome)}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{formatValue(balance.total)}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(({id, title, category, formattedValue, formattedDate, type})=>{
                return (
                  <tr key={id}>
                    <td className="title">{title}</td>
                    <td className={type}>
                      {type==='outcome' && '- '}
                      {formattedValue}
                    </td>
                    <td>{category.title}</td>
                    <td>{formattedDate}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
