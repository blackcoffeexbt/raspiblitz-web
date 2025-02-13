import { ShareIcon } from "@bitcoin-design/bitcoin-icons-react/filled";
import AvailableBalance from "components/AvailableBalance";
import type { ChangeEvent } from "react";
import { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { convertMSatToSat } from "utils/format";
import ButtonWithSpinner from "../../../components/ButtonWithSpinner/ButtonWithSpinner";
import InputField from "../../../components/InputField";
import Message from "../../../components/Message";

export type Props = {
  lnBalance: number;
  loading: boolean;
  onConfirm: () => void;
  onChangeInvoice: (event: ChangeEvent<HTMLInputElement>) => void;
  error: string;
};
interface IFormInputs {
  invoiceInput: string;
}

const SendLn: FC<Props> = ({
  loading,
  lnBalance,
  onConfirm,
  onChangeInvoice,
  error,
}) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInputs> = (_) => onConfirm();

  const convertedBalance = lnBalance ? convertMSatToSat(lnBalance) : 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-xl font-bold">{t("wallet.send_lightning")}</h3>

      <AvailableBalance balance={convertedBalance!} />

      <InputField
        {...register("invoiceInput", {
          required: t("forms.validation.lnInvoice.required"),
          pattern: {
            value: /^(lnbc|lntb)\w+/i,
            message: t("forms.validation.lnInvoice.patternMismatch"),
          },
          onChange: onChangeInvoice,
        })}
        label={t("wallet.invoice")}
        errorMessage={errors.invoiceInput}
        placeholder="lnbc..."
        disabled={loading}
      />

      {error && <Message message={error} />}

      <ButtonWithSpinner
        type="submit"
        className="bd-button my-8 p-3"
        loading={loading}
        disabled={!isValid || loading}
        icon={<ShareIcon className="mr-2 h-6 w-6" />}
      >
        {t("wallet.send")}
      </ButtonWithSpinner>
    </form>
  );
};

export default SendLn;
