import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { TextInput } from '../components/common/TextInput';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Utensils, ShoppingBag, Car, Home, Sparkles, Wallet, Trash2, Calendar, FileText } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionType } from '../types/transaction';
import { DEFAULT_CATEGORIES } from '../services/categoryService';

export const TransactionFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { transactions, addTx, updateTx, deleteTx } = useTransactions();

  const isEdit = Boolean(id);
  const editingTx = isEdit ? transactions.find((t) => t.id === id) : null;

  const [type, setType] = useState<TransactionType>('expense');
  const [amountInput, setAmountInput] = useState<string>('200000');
  const [categoryId, setCategoryId] = useState<string>('food');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (editingTx) {
      setType(editingTx.type);
      setAmountInput(editingTx.amount.toString());
      setCategoryId(editingTx.categoryId);
      setDate(editingTx.date);
      setNote(editingTx.note || '');
    }
  }, [editingTx]);

  const availableCategories = DEFAULT_CATEGORIES.filter(
    (c) => c.type === type || (type === 'expense' && c.type === 'expense')
  );

  const handleQuickAmount = (value: number) => {
    setAmountInput(value.toString());
  };

  const handleFormatAmountDisplay = () => {
    const num = parseInt(amountInput, 10);
    if (isNaN(num)) return '0 đ';
    return new Intl.NumberFormat('vi-VN').format(num) + ' đ';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseInt(amountInput, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ (lớn hơn 0).');
      return;
    }

    const selectedCategory = DEFAULT_CATEGORIES.find((c) => c.id === categoryId);
    const categoryName = selectedCategory ? selectedCategory.name : 'Khác';

    const formattedTime = date === new Date().toISOString().split('T')[0]
      ? 'Hôm nay'
      : date;

    setIsLoading(true);
    try {
      if (isEdit && id) {
        await updateTx(id, {
          type,
          amount: parsedAmount,
          categoryId,
          categoryName,
          date,
          formattedTime,
          note,
        });
      } else {
        await addTx({
          type,
          amount: parsedAmount,
          categoryId,
          categoryName,
          date,
          formattedTime,
          note,
        });
      }
      navigate('/transactions');
    } catch {
      setError('Lỗi khi lưu giao dịch. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      await deleteTx(id);
      setShowConfirmDelete(false);
      navigate('/transactions');
    } catch {
      setError('Lỗi khi xóa giao dịch.');
      setIsLoading(false);
    }
  };

  const getCategoryIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'utensils': return <Utensils className="w-5 h-5" />;
      case 'shopping-bag': return <ShoppingBag className="w-5 h-5" />;
      case 'car': return <Car className="w-5 h-5" />;
      case 'home': return <Home className="w-5 h-5" />;
      case 'sparkles': return <Sparkles className="w-5 h-5" />;
      default: return <Wallet className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F7F8FC] text-[#171923]">
      <div>
        <PageHeader
          title={isEdit ? 'Sửa giao dịch' : 'Thêm giao dịch'}
          rightElement={
            isEdit ? (
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="p-2 text-[#EF4444] hover:bg-red-50 rounded-full transition-colors"
                aria-label="Xóa"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            ) : null
          }
        />

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-[#EF4444] text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Type Toggle Tabs: Chi tiêu vs Thu nhập */}
          <div className="bg-[#F0F2F5] p-1 rounded-xl grid grid-cols-2 gap-1 text-center font-bold text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                if (categoryId === 'salary') setCategoryId('food');
              }}
              className={`py-2.5 rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-[#2F5BEA] text-white shadow-sm'
                  : 'text-[#858A9B] hover:text-[#171923]'
              }`}
            >
              Chi tiêu
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategoryId('salary');
              }}
              className={`py-2.5 rounded-lg transition-all ${
                type === 'income'
                  ? 'bg-[#16A66A] text-white shadow-sm'
                  : 'text-[#858A9B] hover:text-[#171923]'
              }`}
            >
              Thu nhập
            </button>
          </div>

          {/* Amount Input Display */}
          <div className="bg-white rounded-[20px] p-5 border border-[#E8EAF0] shadow-2xs text-center space-y-1">
            <label className="text-xs text-[#858A9B] font-medium block">Số tiền</label>
            <div className="relative flex items-center justify-center">
              <input
                type="number"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="w-full text-center text-2xl sm:text-3xl font-extrabold text-[#171923] outline-none bg-transparent"
                placeholder="0"
              />
            </div>
            <p className="text-xs text-[#2F5BEA] font-bold pt-1">
              {handleFormatAmountDisplay()}
            </p>
          </div>

          {/* Quick Amount Selector Buttons */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
            {[50000, 100000, 200000, 500000, 1000000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAmount(val)}
                className="px-3 py-2 rounded-xl bg-white border border-[#E8EAF0] text-xs font-semibold text-[#171923] hover:border-[#2F5BEA] hover:text-[#2F5BEA] transition-all shrink-0 shadow-2xs"
              >
                {val >= 1000000 ? `${val / 1000000}M` : `${val / 1000}K`}
              </button>
            ))}
          </div>

          {/* Category Selection Grid */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#171923] block">Danh mục</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {availableCategories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all ${
                      isSelected
                        ? 'border-[#2F5BEA] bg-[#2F5BEA]/10 text-[#2F5BEA] shadow-sm'
                        : 'border-[#E8EAF0] bg-white text-[#858A9B] hover:border-gray-300'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${cat.bgTint} ${cat.color}`}>
                      {getCategoryIconComponent(cat.icon)}
                    </div>
                    <span className="text-[11px] font-semibold truncate max-w-[80px]">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Picker */}
          <TextInput
            label="Ngày giao dịch"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            icon={<Calendar className="w-4 h-4" />}
            required
          />

          {/* Note Input */}
          <TextInput
            label="Ghi chú (tùy chọn)"
            placeholder="Ví dụ: Ăn trưa với bạn"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            icon={<FileText className="w-4 h-4" />}
          />

          <div className="pt-3">
            <PrimaryButton type="submit" isLoading={isLoading}>
              {isEdit ? 'Cập nhật giao dịch' : 'Lưu giao dịch'}
            </PrimaryButton>
          </div>
        </form>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        title="Xóa giao dịch?"
        message="Bạn có chắc chắn muốn xóa giao dịch này không? Thao tác này không thể hoàn tác."
        confirmText="Xóa"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmDelete(false)}
        isLoading={isLoading}
      />
    </div>
  );
};
