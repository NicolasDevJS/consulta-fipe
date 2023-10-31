import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

import { api } from "@/services/api"

import { ApiError } from "@/types/ApiError"
import {Brand,CarSpecification, CarSpecificationResponse, Model,Year} from "@/types/CarSpecification"

export interface FipeContextData {
  brands: Brand[]
  selectedBrand: Brand | null
  setSelectedBrand: (brand: Brand | null) => void

  models: Model[]
  selectedModel: Model | null
  setSelectedModel: (model: Model | null) => void

  years: Year[]
  selectedYear: Year | null
  setSelectedYear: (year: Year | null) => void

  handleGetCarPrice: () => Promise<boolean>
  selectedCarSpecification: CarSpecification | undefined
  isCarPriceLoading: boolean
}

export const FipeContext = createContext<FipeContextData>({} as FipeContextData)

interface FipeProviderProps {
  children: ReactNode;
}

export function FipeProvider({ children }: FipeProviderProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [years, setYears] = useState<Year[]>([]);
  const [selectedYear, setSelectedYear] = useState<Year | null>(null);
  const [selectedCarSpecification, setSelectedCarSpecification] = useState<CarSpecification>();
  const [isCarPriceLoading, setIsCarPriceLoading] = useState(false);


  
  useEffect(() => {
    setSelectedModel(null);
    setSelectedYear(null);

    const fetchBrands = async () => {
      try {
        const { data } = await api.get<Brand[]>("/");
        const options = data.map((item) => ({ ...item, label: item.nome }))
        setBrands(options);
      } catch (error) {
        const message = (error as ApiError).response?.data?.message ||
          "Ocorreu um erro ao buscar as marcas";
        console.error(message);
      }
    }

    fetchBrands();
  }, [selectedBrand]);

  useEffect(() => {
    setSelectedYear(null);

    if (selectedBrand?.codigo) {
      const fetchModels = async () => {
        try {
          setYears([]);
          const { data } = await api.get<{ modelos: Model[] }>(
            `${selectedBrand?.codigo}/modelos`
          );
          const options = data.modelos.map((item) => ({
            ...item,
            label: item.nome,
          }));
          setModels(options);
        } catch (error) {
          const message = (error as ApiError).response?.data?.message ||
            "Ocorreu um erro ao buscar os modelos";
          console.error(message);
        }
      }

      fetchModels();
    }
  }, [selectedBrand, selectedModel]);

  useEffect(() => {
    
    if (selectedBrand?.codigo && selectedModel?.codigo) {
      const fetchYears = async () => {
        try {
          const { data } = await api.get<Year[]>(
            `${selectedBrand?.codigo}/modelos/${selectedModel?.codigo}/anos`
          );
          const options = data.map((item) => ({ ...item, label: item.nome }))
          setYears(options);
        } catch (error) {
          const message = (error as ApiError).response?.data?.message ||
            "Ocorreu um erro e não foi possível buscar o ano do modelo selecionado";
          console.error(message);
        }
      }

      fetchYears();
    }
  }, [selectedBrand, selectedModel]);

  const handleGetCarPrice = useCallback(async () => {
    if (!selectedBrand?.codigo || !selectedModel?.codigo || !selectedYear?.codigo) {
      console.log("Preencha todos os campos para realizar a busca.");
      return false;
    }

    try {
      setIsCarPriceLoading(true);
      const { data } = await api.get<CarSpecificationResponse>(
        `${selectedBrand?.codigo}/modelos/${selectedModel?.codigo}/anos/${selectedYear.codigo}`
      );

      setSelectedCarSpecification({
        brand: data.Marca,
        model: data.Modelo,
        year: data.AnoModelo,
        value: data.Valor,
      });

      return true;
    } catch (error) {
      const message = (error as ApiError).response?.data?.message ||
        "Ocorreu um erro e não foi possível consultar o valor do veículo";
      console.error(message);
      return false;
    } finally {
      setIsCarPriceLoading(false);
    }
  }, [selectedBrand, selectedModel, selectedYear]);

  const value = useMemo(
    () => ({
      brands,
      selectedBrand,
      setSelectedBrand,
      models,
      selectedModel,
      setSelectedModel,
      years,
      selectedYear,
      setSelectedYear,
      handleGetCarPrice,
      selectedCarSpecification,
      isCarPriceLoading,
    }),
    [
      brands,
      selectedBrand,
      setSelectedBrand,
      models,
      selectedModel,
      setSelectedModel,
      years,
      selectedYear,
      setSelectedYear,
      handleGetCarPrice,
      selectedCarSpecification,
      isCarPriceLoading,
    ]
  );

  return <FipeContext.Provider value={value}>{children}</FipeContext.Provider>;
}
