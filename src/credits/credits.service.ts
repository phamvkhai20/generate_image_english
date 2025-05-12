import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credit } from './entities/credit.entity';
import { CreateCreditDto } from './dto/create-credit.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CreditsService {
  constructor(
    @InjectRepository(Credit)
    private creditRepository: Repository<Credit>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async createTransaction(userId: number, createCreditDto: CreateCreditDto): Promise<Credit> {
    // Kiểm tra user có tồn tại không
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User không tồn tại');
    }

    const { amount, type, description } = createCreditDto;

    // Get current balance
    const currentBalance = await this.getCurrentBalance(userId);

    // Check balance for withdraw or usage
    if ((type === 'withdraw' || type === 'usage') && currentBalance < amount) {
      throw new BadRequestException('Insufficient balance for this transaction');
    }

    // Calculate new balance
    const newBalance = type === 'deposit' 
      ? currentBalance + amount 
      : currentBalance - amount;

    // Create new transaction with userId
    const credit = this.creditRepository.create({
      userId,  // Make sure userId is included here
      amount,
      type,
      description,
      balance: newBalance,
    });

    return this.creditRepository.save(credit);
  }

  async getCurrentBalance(userId: number): Promise<number> {
    const transactions = await this.creditRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    // Tính tổng số credits từ tất cả giao dịch
    return transactions.reduce((total, transaction) => {
      if (transaction.type === 'deposit') {
        return total + +transaction.amount;
      } else {
        return total - transaction.amount;
      }
    }, 0);
  }

  async getTransactionHistory(userId: number): Promise<Credit[]> {
    return this.creditRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}